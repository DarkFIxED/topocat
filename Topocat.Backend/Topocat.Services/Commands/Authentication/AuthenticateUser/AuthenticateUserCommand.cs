using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Authentication.AuthenticateUser
{
    [RegisterScoped]
    public class AuthenticateUserCommand : ICommand<AuthenticateUserCommandArgs, AuthenticateUserCommandResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly ISecurityTokensFactory _tokensFactory;

        public AuthenticateUserCommand(UserManager<User> userManager, ISecurityTokensFactory tokensFactory)
        {
            _userManager = userManager;
            _tokensFactory = tokensFactory;
        }

        public async Task<AuthenticateUserCommandResult> Execute(AuthenticateUserCommandArgs args)
        {
            var user = await _userManager.FindByEmailAsync(args.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, args.Password))
                throw new ServiceException("User not found or password is incorrect");

            var accessToken = _tokensFactory.GenerateAccessToken(user);
            var refreshToken = _tokensFactory.GenerateRefreshToken(user);

            var tokenHandler = new JwtSecurityTokenHandler();

            return new AuthenticateUserCommandResult
            {
                AccessToken = tokenHandler.WriteToken(accessToken),
                RefreshToken = tokenHandler.WriteToken(refreshToken)
            };
        }
    }
}