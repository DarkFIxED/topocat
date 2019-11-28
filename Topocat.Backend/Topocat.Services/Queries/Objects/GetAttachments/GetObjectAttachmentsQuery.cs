using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Helpers;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Queries.Objects.GetAttachments
{
    [RegisterScoped]
    public class GetObjectAttachmentsQuery : IQuery<GetObjectAttachmentsQueryArgs, GetObjectAttachmentsQueryResult>
    {
        private readonly IRepository _repository;
        private readonly IFileStorageClient _fileStorageClient;
        private readonly EndpointsBuilder _endpointsBuilder;

        public GetObjectAttachmentsQuery(
            IRepository repository, 
            IFileStorageClient fileStorageClient, 
            EndpointsBuilder endpointsBuilder)
        {
            _repository = repository;
            _fileStorageClient = fileStorageClient;
            _endpointsBuilder = endpointsBuilder;
        }

        public async Task<GetObjectAttachmentsQueryResult> Ask(GetObjectAttachmentsQueryArgs queryArgs)
        {
            var attachments = await _repository.AsQueryable<MapObject>()
                .WithId(queryArgs.ObjectId)
                .OfMap(queryArgs.MapId, queryArgs.ActionExecutorId)
                .SelectMany(mapObject => mapObject.FileReferencesBindings)
                .Select(binding => binding.FileReference)
                .AsNoTracking()
                .ToListAsync();

            var result = new GetObjectAttachmentsQueryResult
            {
                Attachments = attachments.Select(attachment => new GetObjectAttachmentsQueryResultItem
                {
                    Id = attachment.Id,
                    AccessUrl = _fileStorageClient.GenerateGetPreSignedUrl(attachment.ObjectKey),
                    MimeType = attachment.MimeType,
                    PreviewTemplate = MimeTypesHelper.IsPreviewSupporting(attachment.MimeType) 
                        ? _endpointsBuilder.BuildImagePreviewUrl(attachment.ObjectKey) 
                        : null

                }).ToList()
            };

            return result;
        }
    }
}