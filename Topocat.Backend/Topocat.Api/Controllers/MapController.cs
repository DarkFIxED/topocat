using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services;
using Topocat.Services.Commands.Maps.AddLine;
using Topocat.Services.Commands.Maps.Create;
using Topocat.Services.Commands.Maps.UpdateTitle;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly ICommandsFactory _commandsFactory;

        public MapController(ICommandsFactory commandsFactory)
        {
            _commandsFactory = commandsFactory;
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

        [Route("/map/{mapId}/objects/lines")]
        [HttpPost]
        public async Task<ApiResponse> AddLine([FromRoute] string mapId, [FromBody] AddLineRequestModel model)
        {
            var addLineCommand = _commandsFactory.Get<AddLineCommand>();

            var result = await addLineCommand.Execute(new AddLineCommandArgs
            {
                Title = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Start = model.Start,
                End = model.End
            });

            return ApiResponse.Success(result);
        }
    }
}