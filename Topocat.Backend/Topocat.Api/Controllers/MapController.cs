using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services.Commands.Maps.CreateMap;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly CreateMapCommand _createMapCommand;

        public MapController(CreateMapCommand createMapCommand)
        {
            _createMapCommand = createMapCommand;
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
    }
}