using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Topocat.Domain.Users;

namespace Topocat.API.Controllers
{
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public AuthenticationController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        
    }
}