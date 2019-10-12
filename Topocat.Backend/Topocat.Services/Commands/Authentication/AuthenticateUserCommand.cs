using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Topocat.Domain.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.Models;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Topocat.Services.Commands.Authentication
{
    public class AuthenticateUserCommand : ICommand<AuthenticateUserCommandArgs, AuthenticateUserCommandResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly IOptions<JWTOptions> _jwtOptions;

        public AuthenticateUserCommand(UserManager<User> userManager, IOptions<JWTOptions> jwtOptions)
        {
            _userManager = userManager;
            _jwtOptions = jwtOptions;
        }

        public async Task<AuthenticateUserCommandResult> Execute(AuthenticateUserCommandArgs args)
        {
            var user = await _userManager.FindByEmailAsync(args.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, args.Password))
                throw new ServiceException("User not found or password is incorrect");

            var authClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.Value.Key));

            var token = new JwtSecurityToken(
                issuer: _jwtOptions.Value.Issuer,
                audience: _jwtOptions.Value.Audience,
                expires: DateTime.UtcNow.Add(_jwtOptions.Value.LifeTime),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return new AuthenticateUserCommandResult
            {
                BearerToken = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}