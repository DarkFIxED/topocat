using System.Security.Claims;
using System.Threading.Tasks;
using Topocat.BusinessLogic.User.Models;

namespace Topocat.BusinessLogic.User
{
    public interface IUserService
    {
        Task<string> Register(RegistrationModel model);
        Task<string> Login(LoginModel model);
        Task<Domain.User> GetCurrentUser(ClaimsPrincipal currentUser);
    }
}