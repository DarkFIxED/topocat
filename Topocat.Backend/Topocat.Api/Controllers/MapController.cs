using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Create;
using Topocat.Services.Commands.Maps.Update;
using Topocat.Services.Queries.Map.GetMapQuery;
using Topocat.Services.Queries.Map.GetMapsListQuery;

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

        [Route("/maps")]
        [HttpGet]
        public async Task<ApiResponse> GetMapsList()
        {
            var getMApsListQuery = _queriesFactory.Get<GetMapsListQuery>();

            var args = new GetMapsListQueryArgs
            {
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            var result = await getMApsListQuery.Ask(args);

            return ApiResponse.Success(result);
        }

        [Route("/maps")]
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

        [Route("/maps/{mapId}")]
        [HttpPut]
        public async Task<ApiResponse> UpdateMap([FromRoute] string mapId, [FromBody] UpdateMapTitleRequestModel model)
        {
            var updateMapTitleCommand = _commandsFactory.Get<UpdateMapCommand>();

            await updateMapTitleCommand.Execute(new UpdateMapCommandArgs
            {
                NewTitle = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success();
        }

        [Route("/maps/{mapId}")]
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