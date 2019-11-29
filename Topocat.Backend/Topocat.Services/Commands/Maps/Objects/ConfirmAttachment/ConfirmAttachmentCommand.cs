using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.Objects.ConfirmAttachment
{
    [RegisterScoped]
    public class ConfirmAttachmentCommand : ICommand<ConfirmAttachmentCommandArgs>
    {
        private readonly IRepository _repository;

        public ConfirmAttachmentCommand(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Execute(ConfirmAttachmentCommandArgs args)
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

            attachment.ConfirmUpload();

            _repository.Update(attachment);
            await _repository.SaveAsync();
        }
    }
}