using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;

namespace Topocat.Services.Commands.Users.SignUp
{
    [RegisterScoped]
    public class SignUpUserCommand : ICommand<SignUpUserCommandArgs>
    {
        private readonly UserManager<User> _userManager;

        public SignUpUserCommand(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task Execute(SignUpUserCommandArgs args)
        {
            var user = new User(args.Email);
            var result = await _userManager.CreateAsync(user, args.Password);

            if (!result.Succeeded)
                throw new ServiceException(result.Errors.First().Description);
        }
    }
}