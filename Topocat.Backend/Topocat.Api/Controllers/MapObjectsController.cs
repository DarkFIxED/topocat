using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.MapObjects;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Objects.AddAttachment;
using Topocat.Services.Commands.Maps.Objects.AddObject;
using Topocat.Services.Commands.Maps.Objects.ConfirmAttachment;
using Topocat.Services.Commands.Maps.Objects.RemoveAttachment;
using Topocat.Services.Commands.Maps.Objects.RemoveObject;
using Topocat.Services.Commands.Maps.Objects.UpdateObject;
using Topocat.Services.Queries.Map.GetMapObjects;
using Topocat.Services.Queries.Objects.GetAttachment;
using Topocat.Services.Queries.Objects.GetAttachments;
using Topocat.Services.Queries.Objects.TagsSearch;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapObjectsController : ControllerBase
    {
        private readonly ICommandsFactory _commandsFactory;
        private readonly IQueriesFactory _queriesFactory;

        public MapObjectsController(ICommandsFactory commandsFactory, IQueriesFactory queriesFactory)
        {
            _commandsFactory = commandsFactory;
            _queriesFactory = queriesFactory;
        }

        [Route("/maps/{mapId}/objects")]
        [HttpGet]
        public async Task<ApiResponse> GetMapObjects([FromRoute] string mapId)
        {
            var query = _queriesFactory.Get<GetMapObjectsQuery>();

            var args = new GetMapObjectsQueryArgs
            {
                ActionExecutorId = HttpContext.User.GetUserId(),
                MapId = mapId
            };

            var result = await query.Ask(args);

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects")]
        [HttpPost]
        public async Task<ApiResponse> AddPoint([FromRoute] string mapId, [FromBody] AddObjectRequestModel model)
        {
            var addPointCommand = _commandsFactory.Get<AddObjectCommand>();

            var result = await addPointCommand.Execute(new AddObjectCommandArgs
            {
                Title = model.Title,
                Description = model.Description,
                MapId = mapId,
                WktString = model.WktString,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Tags = model.Tags
            });

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects/{objectId}")]
        [HttpPut]
        public async Task<ApiResponse> UpdateObject([FromRoute] string mapId, [FromRoute] string objectId, [FromBody] UpdateObjectRequestModel model)
        {
            var updateLineCommand = _commandsFactory.Get<UpdateObjectCommand>();

            await updateLineCommand.Execute(new UpdateObjectCommandArgs
            {
                Title = model.Title,
                Description = model.Description,
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                WktString = model.WktString,
                Tags = model.Tags
            });

            return ApiResponse.Success();
        }

        [Route("/maps/{mapId}/objects/{objectId}")]
        [HttpDelete]
        public async Task<ApiResponse> RemoveObject([FromRoute] string mapId, [FromRoute] string objectId)
        {
            var updateLineCommand = _commandsFactory.Get<RemoveObjectCommand>();

            await updateLineCommand.Execute(new RemoveObjectCommandArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
            });

            return ApiResponse.Success();
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments")]
        [HttpPost]
        public async Task<ApiResponse> AddAttachment([FromRoute] string mapId, [FromRoute] string objectId, [FromBody] AddAttachmentRequestModel model)
        {
            var updateLineCommand = _commandsFactory.Get<AddAttachmentCommand>();

            var result = await updateLineCommand.Execute(new AddAttachmentCommandArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                SourceFileName = model.SourceFileName,
                MimeType = model.MimeType
            });

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments")]
        [HttpGet]
        public async Task<ApiResponse> GetAttachments([FromRoute] string mapId, [FromRoute] string objectId)
        {
            var getObjectAttachmentsQuery = _queriesFactory.Get<GetObjectAttachmentsQuery>();

            var result = await getObjectAttachmentsQuery.Ask(new GetObjectAttachmentsQueryArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments/{attachmentId}")]
        [HttpDelete]
        public async Task<ApiResponse> RemoveAttachment([FromRoute] string mapId, [FromRoute] string objectId, [FromRoute] string attachmentId)
        {
            var updateLineCommand = _commandsFactory.Get<RemoveAttachmentCommand>();

            await updateLineCommand.Execute(new RemoveAttachmentCommandArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                AttachmentId = attachmentId
            });

            return ApiResponse.Success();
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments/{attachmentId}/confirm")]
        [HttpPost]
        public async Task<IActionResult> ConfirmAttachment([FromRoute] string mapId, [FromRoute] string objectId, [FromRoute] string attachmentId)
        {
            var updateLineCommand = _commandsFactory.Get<ConfirmAttachmentCommand>();

            await updateLineCommand.Execute(new ConfirmAttachmentCommandArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                AttachmentId = attachmentId
            });

            return RedirectToAction("GetAttachment", new {mapId, objectId, attachmentId});
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments/{attachmentId}")]
        [HttpGet]
        public async Task<ApiResponse> GetAttachment([FromRoute] string mapId, [FromRoute] string objectId, [FromRoute] string attachmentId)
        {
            var updateLineCommand = _queriesFactory.Get<GetObjectAttachmentQuery>();

            var result = await updateLineCommand.Ask(new GetObjectAttachmentQueryArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                AttachmentId = attachmentId
            });

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects/tags")]
        [HttpGet]
        public async Task<ApiResponse> GetAttachment([FromRoute] string mapId, [FromQuery] string search)
        {
            var updateLineCommand = _queriesFactory.Get<TagsSearchQuery>();

            var result = await updateLineCommand.Ask(new TagsSearchQueryArgs
            {
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                SearchString = search
            });

            return ApiResponse.Success(result);
        }
    }
}