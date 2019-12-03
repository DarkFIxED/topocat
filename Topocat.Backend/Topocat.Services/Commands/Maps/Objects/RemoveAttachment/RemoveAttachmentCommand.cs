using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.Objects.RemoveAttachment
{
    [RegisterScoped]
    public class RemoveAttachmentCommand : ICommand<RemoveAttachmentCommandArgs>
    {
        private readonly IRepository _repository;

        public RemoveAttachmentCommand(IRepository repository)
        {
            _repository = repository;
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

            attachment.ScheduleToRemove();
            _repository.Update(attachment);

            await _repository.SaveAsync();
        }
    }
}