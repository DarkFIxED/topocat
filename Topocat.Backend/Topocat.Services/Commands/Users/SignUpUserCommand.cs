using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Domain.Users;
using Topocat.Services.Exceptions;

namespace Topocat.Services.Commands.Users
{
    public class SignUpUserCommand : ICommand<(string Email, string Password)>
    {
        private readonly UserManager<User> _userManager;

        public SignUpUserCommand(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task Execute((string Email, string Password) args)
        {
            var (email, password) = args;
            email = email.Trim();
            var user = new User(email);
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
                throw new ServiceException(result.Errors.First().Description);
        }
    }
}