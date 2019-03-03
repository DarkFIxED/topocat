using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

namespace Topocat.Api.Controllers
{
    [ApiController]
    public class HeartBeatController : ControllerBase
    {
        [HttpGet]
        [Route("api/echo")]
        public ActionResult<DateTime> Echo()
        {
            return DateTime.UtcNow;
        }
    }
}
