using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Helpers;
using Topocat.Services.Queries.Objects.GetAttachments;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Queries.Objects.GetAttachment
{
    [RegisterScoped]
    public class GetObjectAttachmentQuery : IQuery<GetObjectAttachmentQueryArgs, GetObjectAttachmentQueryResult>
    {
        private readonly IRepository _repository;
        private readonly IFileStorageClient _fileStorageClient;
        private readonly EndpointsBuilder _endpointsBuilder;

        public GetObjectAttachmentQuery(
            IRepository repository,
            IFileStorageClient fileStorageClient,
            EndpointsBuilder endpointsBuilder
        )
        {
            _repository = repository;
            _fileStorageClient = fileStorageClient;
            _endpointsBuilder = endpointsBuilder;
        }

        public async Task<GetObjectAttachmentQueryResult> Ask(GetObjectAttachmentQueryArgs args)
        {
            var attachment = await _repository.AsQueryable<MapObject>()
                .WithId(args.ObjectId)
                .OfMap(args.MapId, args.ActionExecutorId)
                .SelectMany(mapObject => mapObject.FileReferencesBindings)
                .Select(binding => binding.FileReference)
                .WithId(args.AttachmentId)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            var result = new GetObjectAttachmentQueryResult
            {
                Id = attachment.Id,
                AccessUrl = _fileStorageClient.GenerateGetPreSignedUrl(attachment.ObjectKey),
                MimeType = attachment.MimeType,
                PreviewTemplate = MimeTypesHelper.IsPreviewSupporting(attachment.MimeType)
                    ? _endpointsBuilder.BuildImagePreviewUrl(attachment.ObjectKey)
                    : null
            };

            return result;
        }
    }
}