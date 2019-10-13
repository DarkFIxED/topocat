using Microsoft.AspNetCore.Authorization;
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

        [Authorize]
        [HttpGet]
        [Route("/probes/auth")]
        public ApiResponse LiveAuth()
        {
            return ApiResponse.Success("Ok");
        }
    }
}