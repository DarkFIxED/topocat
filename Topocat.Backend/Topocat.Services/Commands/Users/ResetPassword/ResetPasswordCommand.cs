using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;

namespace Topocat.Services.Commands.Users.ResetPassword
{
    [RegisterScoped]
    public class ResetPasswordCommand : ICommand<ResetPasswordCommandArgs>
    {
        private readonly UserManager<User> _userManager;

        public ResetPasswordCommand(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task Execute(ResetPasswordCommandArgs args)
        {
            var user = await _userManager.FindByEmailAsync(args.Email);
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User not found");

            var result = await _userManager.ResetPasswordAsync(user, args.Token, args.Password);

            if (!result.Succeeded)
                throw new ServiceException(result.Errors.First().Description);
        }
    }
}