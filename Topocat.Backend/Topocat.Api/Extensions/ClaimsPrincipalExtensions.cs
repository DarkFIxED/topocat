using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Topocat.API.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            return principal.HasClaim(claim => claim.Type == JwtRegisteredClaimNames.Sid) 
                ? principal.FindFirst(JwtRegisteredClaimNames.Sid).Value 
                : null;
        }
    }
}