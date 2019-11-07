using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Models;
using Topocat.API.Models.Users;
using Topocat.Services.Commands.Authentication.AuthenticateUser;
using Topocat.Services.Commands.Authentication.RenewAuthentication;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Produces("application/json")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AuthenticateUserCommand _authenticateUserCommand;
        private readonly RenewAuthenticationCommand _renewAuthenticationCommand;

        public AuthenticationController(
            AuthenticateUserCommand authenticateUserCommand, 
            RenewAuthenticationCommand renewAuthenticationCommand
            )
        {
            _authenticateUserCommand = authenticateUserCommand;
            _renewAuthenticationCommand = renewAuthenticationCommand;
        }

        [Route("/authenticate")]
        [HttpPost]
        public async Task<ApiResponse> Authenticate(AuthenticateRequestModel model)
        {
            var result = await _authenticateUserCommand.Execute(new AuthenticateUserCommandArgs
            {
                Email = model.Email,
                Password = model.Password
            });

            return ApiResponse.Success(result);
        }

        [Route("/authenticate/renew")]
        [HttpPost]
        public async Task<ApiResponse> RenewAuthentication(RenewAuthenticationRequestModel model)
        {
            var result = await _renewAuthenticationCommand.Execute(new RenewAuthenticationCommandArgs
            {
                RefreshToken = model.RefreshToken
            });

            return ApiResponse.Success(result);
        }
    }
}