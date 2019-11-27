using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;
using Topocat.Services.Services.Background;

namespace Topocat.Services.Commands.Maps.Objects.RemoveAttachment
{
    [RegisterScoped]
    public class RemoveAttachmentCommand : ICommand<RemoveAttachmentCommandArgs>
    {
        private readonly IRepository _repository;
        private readonly IBackgroundTaskQueue _backgroundTaskQueue;

        public RemoveAttachmentCommand(IRepository repository, IBackgroundTaskQueue backgroundTaskQueue)
        {
            _repository = repository;
            _backgroundTaskQueue = backgroundTaskQueue;
        }

        public async Task Execute(RemoveAttachmentCommandArgs args)
        {
            var attachment = await _repository.AsQueryable<MapObject>()
                .WithId(args.ObjectId)
                .OfMap(args.MapId, args.ActionExecutorId)
                .SelectMany(x => x.FileReferencesBindings)
                .Select(x => x.FileReference)
                .WithId(args.AttachmentId)
                .FirstOrDefaultAsync();

            if (attachment == null)
                throw new ServiceException("Attachment not found");

            _repository.Delete(attachment);

            _backgroundTaskQueue.QueueBackgroundWorkItem(async (token, provider) =>
            {
                var fileStorageClient = (IFileStorageClient)provider.GetService(typeof(IFileStorageClient));
                await fileStorageClient.Remove(attachment.ObjectKey);
            });

            await _repository.SaveAsync();
        }
    }
}