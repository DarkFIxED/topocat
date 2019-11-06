using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Models;
using Topocat.API.Models.PasswordRestoration;
using Topocat.Services;
using Topocat.Services.Commands.Users.ResetPassword;
using Topocat.Services.Commands.Users.RestorePasswordRequest;
using Topocat.Services.Exceptions;

namespace Topocat.API.Controllers
{
    [ApiController]
    [AllowAnonymous]
    public class PasswordRestorationController : ControllerBase
    {

        private readonly ICommandsFactory _commandsFactory;

        public PasswordRestorationController(ICommandsFactory commandsFactory)
        {
            _commandsFactory = commandsFactory;
        }

        [HttpPost]
        [Route("/restore-password-request")]
        public async Task<ApiResponse> RequestPasswordRestoration([FromBody]PasswordRestorationRequestModel requestModelModel)
        {
            var command = _commandsFactory.Get<RestorePasswordRequestCommand>();

            var args = new RestorePasswordRequestCommandArgs
            {
                Email = requestModelModel.Email
            };

            try
            {
                await command.Execute(args);
            }
            catch (ServiceException)
            {
            }

            return ApiResponse.Success();
        }

        [HttpPost]
        [Route("/reset-password")]
        public async Task<ApiResponse> ResetPassword([FromBody]ResetPasswordRequestModel requestModel)
        {
            var command = _commandsFactory.Get<ResetPasswordCommand>();

            var args = new ResetPasswordCommandArgs
            {
                Email = requestModel.Email,
                Token = requestModel.Token,
                Password = requestModel.Password
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }
    }
}