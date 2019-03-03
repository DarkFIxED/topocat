using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.Api.AppHelpers;
using Topocat.BusinessLogic.User;
using Topocat.BusinessLogic.User.Models;

namespace Topocat.Api.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;

        public AccountController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Route("user-info")]
        [Authorize]
        public async Task<IActionResult> GetInfo()
        {
            var currentUser = await _userService.GetCurrentUser(HttpContext.User);

            return new JsonNetCamelCasedResult(AjaxResponse.Success(new
            {
                currentUser.Email,
                currentUser.Login
            }));
        }

        [HttpPost]
        [Route("sign-up")]
        public async Task<IActionResult> Register(RegistrationModel model)
        {
            var token = await _userService.Register(model);

            return new JsonNetCamelCasedResult(AjaxResponse.Success(token));
        }

        [HttpPost]
        [Route("sign-in")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var token = await _userService.Login(model);

            return new JsonNetCamelCasedResult(AjaxResponse.Success(token));
        }
    }
}