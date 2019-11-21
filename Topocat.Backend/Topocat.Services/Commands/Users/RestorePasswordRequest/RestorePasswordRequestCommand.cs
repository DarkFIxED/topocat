using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Emails;
using Topocat.Services.Exceptions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Users.RestorePasswordRequest
{
    [RegisterScoped]
    public class RestorePasswordRequestCommand : ICommand<RestorePasswordRequestCommandArgs>
    {
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly EmailMessageFactory _emailMessageFactory;

        public RestorePasswordRequestCommand(UserManager<User> userManager, IEmailService emailService, EmailMessageFactory emailMessageFactory)
        {
            _userManager = userManager;
            _emailService = emailService;
            _emailMessageFactory = emailMessageFactory;
        }

        public async Task Execute(RestorePasswordRequestCommandArgs args)
        {
            var user = await _userManager.FindByEmailAsync(args.Email);
            if (user == null)
                throw new ServiceException("User not found");

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var emailTemplateArgs = new ResetPasswordEmailTemplateArgs
            {
                Token = token,
                Address = user.Email
            };

            var message = _emailMessageFactory.Get<ResetPasswordEmailTemplate, ResetPasswordEmailTemplateArgs>(emailTemplateArgs);

            _emailService.SendEmail(message);
        }
    }
}