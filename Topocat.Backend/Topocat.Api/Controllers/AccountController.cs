using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.Api.AppHelpers;
using Topocat.BusinessLogic.Services.User;
using Topocat.BusinessLogic.Services.User.Models;

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

            return new JsonResult(AjaxResponse.Success(new
            {
                currentUser.Email,
                currentUser.Login
            }));
        }

        [HttpPost]
        [Route("sign-up")]
        public async Task<IActionResult> SignUp(SignUpModel model)
        {
            var token = await _userService.SignUp(model);

            return new JsonResult(AjaxResponse.Success(token));
        }

        [HttpPost]
        [Route("sign-in")]
        public async Task<IActionResult> SignIn(SignInModel model)
        {
            var token = await _userService.SignIn(model);

            return new JsonResult(AjaxResponse.Success(token));
        }
    }
}