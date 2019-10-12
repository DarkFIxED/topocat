using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Models;
using Topocat.API.Models.Users;
using Topocat.Services.Commands.Authentication;

namespace Topocat.API.Controllers
{
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly AuthenticateUserCommand _authenticateUserCommand;
        public AuthenticationController(AuthenticateUserCommand authenticateUserCommand)
        {
            _authenticateUserCommand = authenticateUserCommand;
        }

        [Route("/authenticate")]
        [HttpPost]
        public async Task<ApiResponse> Authenticate(AuthenticateRequestModel model)
        {
            var token = await _authenticateUserCommand.Execute(new AuthenticateUserCommandArgs
            {
                Email = model.Email,
                Password = model.Password
            });

            return ApiResponse.Success(token);
        }
    }
}