using Microsoft.AspNetCore.Mvc;
using Topocat.API.Models;

namespace Topocat.API.Controllers
{
    [ApiController]
    public class HeartbeatController : ControllerBase
    {
        [HttpGet]
        [Route("/probes/live")]
        public ApiResponse LiveProbe()
        {
            return ApiResponse.Success("Ok");
        }
    }
}