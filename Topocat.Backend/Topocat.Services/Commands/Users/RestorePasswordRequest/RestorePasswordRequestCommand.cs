using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.Models;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Users.RestorePasswordRequest
{
    [RegisterScoped]
    public class RestorePasswordRequestCommand : ICommand<RestorePasswordRequestCommandArgs>
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;

        public RestorePasswordRequestCommand(UserManager<User> userManager, IEmailService emailService)
        {
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task Execute(RestorePasswordRequestCommandArgs args)
        {
            var user = await _userManager.FindByEmailAsync(args.Email);
            if (user == null)
                throw new ServiceException("User not found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            _emailService.SendEmail(new EmailMessage
            {
                Subject = "Password restoration",
                Body = $"Token: {token}, email: {args.Email}",
                Addresses = new []{user.Email}
            });
        }
    }
}