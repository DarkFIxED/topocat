using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Queries.Objects.GetAttachments
{
    [RegisterScoped]
    public class GetObjectAttachmentsQuery : IQuery<GetObjectAttachmentsArgs, GetObjectAttachmentsResult>
    {
        private readonly IRepository _repository;
        private readonly IFileStorageClient _fileStorageClient;

        public GetObjectAttachmentsQuery(IRepository repository, IFileStorageClient fileStorageClient)
        {
            _repository = repository;
            _fileStorageClient = fileStorageClient;
        }

        public async Task<GetObjectAttachmentsResult> Ask(GetObjectAttachmentsArgs args)
        {
            var attachments = await _repository.AsQueryable<MapObject>()
                .WithId(args.ObjectId)
                .OfMap(args.MapId, args.ActionExecutorId)
                .SelectMany(mapObject => mapObject.FileReferencesBindings)
                .Select(binding => binding.FileReference)
                .AsNoTracking()
                .ToListAsync();

            var result = new GetObjectAttachmentsResult
            {
                Attachments = attachments.Select(attachment => new GetObjectAttachmentsResultItem
                {
                    AccessUrl = _fileStorageClient.GenerateGetPreSignedUrl(attachment.ObjectKey),
                    MimeType = attachment.MimeType
                }).ToList()
            };

            return result;
        }
    }
}