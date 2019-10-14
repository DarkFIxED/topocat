using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Topocat.Domain.Users;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Authentication.RenewAuthentication
{
    public class RenewAuthenticationCommand : ICommand<RenewAuthenticationCommandArgs, RenewAuthenticationCommandResult>
    {
        private readonly TokenValidationParameters _tokenValidationParameters;
        private readonly ISecurityTokensFactory _tokensFactory;
        private readonly UserManager<User> _userManager;

        public RenewAuthenticationCommand(
            TokenValidationParameters tokenValidationParameters,
            ISecurityTokensFactory tokensFactory, 
            UserManager<User> userManager)
        {
            _tokenValidationParameters = tokenValidationParameters;
            _tokensFactory = tokensFactory;
            _userManager = userManager;
        }

        public async Task<RenewAuthenticationCommandResult> Execute(RenewAuthenticationCommandArgs args)
        {
            var tokenHandler = new JwtSecurityTokenHandler();

            var principle = tokenHandler.ValidateToken(args.RefreshToken, _tokenValidationParameters, out _);
            var id = principle.FindFirst(JwtRegisteredClaimNames.Sid).Value;
            var user = await _userManager.FindByIdAsync(id);

            return new RenewAuthenticationCommandResult
            {
                AccessToken = tokenHandler.WriteToken(_tokensFactory.GenerateAccessToken(user)),
                RefreshToken = tokenHandler.WriteToken(_tokensFactory.GenerateRefreshToken(user))
            };
        }
    }
}