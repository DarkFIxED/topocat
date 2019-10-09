using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Models;
using Topocat.API.Models.Users;
using Topocat.Services.Commands.Users;

namespace Topocat.API.Controllers
{
    [ApiController]
    public class SingUpController : ControllerBase
    {
        private readonly SignUpUserCommand _signUpUserCommand;

        public SingUpController(SignUpUserCommand signUpUserCommand)
        {
            _signUpUserCommand = signUpUserCommand;
        }

        [Route("/users/sign-up")]
        [HttpPost]
        public async Task<ApiResponse> SignUp(SignUpRequestModel model)
        {
            await _signUpUserCommand.Execute((model.Email, model.Password));

            return ApiResponse.Success();
        }
    }
}