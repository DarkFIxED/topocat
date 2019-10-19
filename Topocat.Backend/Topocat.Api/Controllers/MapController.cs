using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services;
using Topocat.Services.Commands.Maps.AddObject;
using Topocat.Services.Commands.Maps.Create;
using Topocat.Services.Commands.Maps.UpdateObject;
using Topocat.Services.Commands.Maps.UpdateTitle;
using Topocat.Services.Queries.Map.GetMapQuery;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly ICommandsFactory _commandsFactory;
        private readonly IQueriesFactory _queriesFactory;

        public MapController(ICommandsFactory commandsFactory, IQueriesFactory queriesFactory)
        {
            _commandsFactory = commandsFactory;
            _queriesFactory = queriesFactory;
        }

        [Route("/map")]
        [HttpPost]
        public async Task<ApiResponse> CreateMap(CreateMapRequestModel model)
        {
            var createMapCommand = _commandsFactory.Get<CreateMapCommand>();

            var result = await createMapCommand.Execute(new CreateMapCommandArgs
            {
                Title = model.Title,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }

        [Route("/map/{mapId}/title")]
        [HttpPut]
        public async Task<ApiResponse> UpdateMapTitle([FromRoute] string mapId, [FromBody] UpdateMapTitleRequestModel model)
        {
            var updateMapTitleCommand = _commandsFactory.Get<UpdateMapTitleCommand>();

            await updateMapTitleCommand.Execute(new UpdateMapTitleCommandArgs
            {
                NewTitle = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success();
        }

        [Route("/map/{mapId}/objects")]
        [HttpPost]
        public async Task<ApiResponse> AddPoint([FromRoute] string mapId, [FromBody] AddFeatureRequestModel model)
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

        [Route("/map/{mapId}/objects/{objectId}")]
        [HttpPut]
        public async Task<ApiResponse> UpdatePoint([FromRoute] string mapId, [FromRoute] string objectId, [FromBody] UpdateObjectRequestModel model)
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

        [Route("/map/{mapId}")]
        [HttpGet]
        public async Task<ApiResponse> GetMap([FromRoute] string mapId)
        {
            var getMapQuery = _queriesFactory.Get<GetMapQuery>();

            var result = await getMapQuery.Ask(new GetMapQueryArgs
            {
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }
    }
}