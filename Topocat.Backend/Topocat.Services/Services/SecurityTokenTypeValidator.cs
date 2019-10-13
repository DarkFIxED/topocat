using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Topocat.Services.Services
{
    public class SecurityTokenTypeValidator : ISecurityTokenValidator
    {
        private readonly ISecurityTokenValidator _underlyingValidator;

        public SecurityTokenTypeValidator(ISecurityTokenValidator underlyingValidator)
        {
            _underlyingValidator = underlyingValidator;
        }

        public bool CanReadToken(string securityToken)
        {
            return _underlyingValidator.CanReadToken(securityToken);
        }

        public ClaimsPrincipal ValidateToken(string securityToken, TokenValidationParameters validationParameters,
            out SecurityToken validatedToken)
        {
            var result = _underlyingValidator.ValidateToken(securityToken, validationParameters, out validatedToken);

            var claim = result.Claims.SingleOrDefault(x => x.Type == JwtRegisteredClaimNames.Typ && x.Value == TokenTypes.Access);

            if (claim == null)
                throw new SecurityTokenException();

            return result;
        }

        public bool CanValidateToken => _underlyingValidator.CanValidateToken;

        public int MaximumTokenSizeInBytes
        {
            get => _underlyingValidator.MaximumTokenSizeInBytes;
            set => _underlyingValidator.MaximumTokenSizeInBytes = value;
        }
    }
}