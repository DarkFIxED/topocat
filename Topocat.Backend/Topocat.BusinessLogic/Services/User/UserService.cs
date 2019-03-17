using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Topocat.BusinessLogic.Services.User.Models;
using Topocat.Common.Settings;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Topocat.BusinessLogic.Services.User
{
    public class UserService : IUserService
    {
        private readonly UserManager<Domain.User> _userManager;

        private readonly SignInManager<Domain.User> _signInManager;

        private readonly JwtSettings _jwtSettings;

        public UserService(UserManager<Domain.User> userManager, SignInManager<Domain.User> signInManager, JwtSettings jwtSettings)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSettings = jwtSettings;
        }

        public async Task<Domain.User> GetCurrentUser(ClaimsPrincipal currentUser)
        {
            return await _userManager.GetUserAsync(currentUser);
        }

        public async Task<string> SignUp(SignUpModel model)
        {
            var user = new Domain.User
            {
                UserName = model.Email,
                Email = model.Email,
                Login = model.Login
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded) throw new ApplicationException(result.Errors.First().Description);

            await _signInManager.SignInAsync(user, false);
            return GenerateJwtToken(model.Email, user);
        }

        public async Task<string> SignIn(SignInModel model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

            if (!result.Succeeded) throw new ApplicationException("Sign in has been failed");

            var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
            return GenerateJwtToken(model.Email, appUser);
        }

        private string GenerateJwtToken(string email, Domain.User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.JwtKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(_jwtSettings.JwtExpireDays));

            var token = new JwtSecurityToken(
                _jwtSettings.JwtIssuer,
                _jwtSettings.JwtAudience,
                claims,
                expires: expires,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
