using System;
using Microsoft.AspNetCore.Mvc;
using Topocat.Api.AppHelpers;

namespace Topocat.Api.Controllers
{
    [ApiController]
    public class HeartBeatController : ControllerBase
    {
        [HttpGet]
        [Route("api/echo")]
        public ActionResult<DateTime> Echo()
        {
            return new JsonResult(AjaxResponse.Success(DateTime.UtcNow));
        }
    }
}
