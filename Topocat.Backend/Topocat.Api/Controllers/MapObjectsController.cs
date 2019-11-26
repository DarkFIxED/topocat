using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Objects.AddAttachment;
using Topocat.Services.Commands.Maps.Objects.AddObject;
using Topocat.Services.Commands.Maps.Objects.RemoveObject;
using Topocat.Services.Commands.Maps.Objects.UpdateObject;
using Topocat.Services.Queries.Map.GetMapObjects;
using Topocat.Services.Queries.Objects.GetAttachments;

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
                MapId = mapId,
                WktString = model.WktString,
                ActionExecutorId = HttpContext.User.GetUserId(),
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
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                WktString = model.WktString
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
                SourceFileName = model.SourceFileName
            });

            return ApiResponse.Success(result);
        }

        [Route("/maps/{mapId}/objects/{objectId}/attachments")]
        [HttpGet]
        public async Task<ApiResponse> GetAttachments([FromRoute] string mapId, [FromRoute] string objectId)
        {
            var getObjectAttachmentsQuery = _queriesFactory.Get<GetObjectAttachmentsQuery>();

            var result = await getObjectAttachmentsQuery.Ask(new GetObjectAttachmentsArgs
            {
                MapId = mapId,
                ObjectId = objectId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }
    }
}