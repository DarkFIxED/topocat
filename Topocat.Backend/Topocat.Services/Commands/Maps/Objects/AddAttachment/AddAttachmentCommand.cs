using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Maps.Objects.AddAttachment
{
    [RegisterScoped]
    public class AddAttachmentCommand : ICommand<AddAttachmentCommandArgs, AddAttachmentCommandResult>
    {
        private readonly IRepository _repository;
        private readonly IFileStorageClient _fileStorageClient;
        private readonly IFileReferencesFactory _fileReferencesFactory;

        public AddAttachmentCommand(IRepository repository, 
            IFileStorageClient fileStorageClient, 
            IFileReferencesFactory fileReferencesFactory)
        {
            _repository = repository;
            _fileStorageClient = fileStorageClient;
            _fileReferencesFactory = fileReferencesFactory;
        }

        public async Task<AddAttachmentCommandResult> Execute(AddAttachmentCommandArgs args)
        {
            var mapObject = await _repository.AsQueryable<MapObject>()
                .WithId(args.ObjectId)
                .OfMap(args.MapId, args.ActionExecutorId)
                .WithAttachments()
                .FirstOrDefaultAsync();
            
            if (mapObject == null)
                throw new ArgumentNullException(nameof(mapObject), "Map object not found");

            var fileReference = _fileReferencesFactory.GenerateMapObjectAttachment(args.SourceFileName, args.MimeType);

            mapObject.AddAttachment(fileReference);
            _repository.Create(fileReference);

            var uploadUrl = _fileStorageClient.GenerateUploadPreSignedUrl(fileReference.ObjectKey, fileReference.MimeType);

            await _repository.SaveAsync();

            return new AddAttachmentCommandResult
            {
                Id = fileReference.Id,
                UploadUrl = uploadUrl
            };
        }
    }
}