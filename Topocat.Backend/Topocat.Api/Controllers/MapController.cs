using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services.Commands.Maps.CreateMap;
using Topocat.Services.Commands.Maps.UpdateMapTitle;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly CreateMapCommand _createMapCommand;
        private readonly UpdateMapTitleCommand _updateMapTitleCommand;

        public MapController(CreateMapCommand createMapCommand, UpdateMapTitleCommand updateMapTitleCommand)
        {
            _createMapCommand = createMapCommand;
            _updateMapTitleCommand = updateMapTitleCommand;
        }

        [Route("/map")]
        [HttpPost]
        public async Task<ApiResponse> CreateMap(CreateMapRequestModel model)
        {
            var result = await _createMapCommand.Execute(new CreateMapCommandArgs
            {
                Title = model.Title,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }

        [Route("/map/{mapId}/title")]
        [HttpPut]
        public async Task<ApiResponse> UpdateMapTitle([FromQuery] string mapId, [FromBody] UpdateMapTitleRequestModel model)
        {
            await _updateMapTitleCommand.Execute(new UpdateMapTitleCommandArgs
            {
                NewTitle = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success();
        }
    }
}