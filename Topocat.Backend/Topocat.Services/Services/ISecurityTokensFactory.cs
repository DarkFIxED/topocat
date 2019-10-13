using System.IdentityModel.Tokens.Jwt;
using Topocat.Domain.Users;

namespace Topocat.Services.Services
{
    public interface ISecurityTokensFactory
    {
        JwtSecurityToken GenerateAccessToken(User user);

        JwtSecurityToken GenerateRefreshToken(User user);
    }
}