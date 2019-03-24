using System.Security.Claims;
using System.Threading.Tasks;
using Topocat.BusinessLogic.Services.User.Models;

namespace Topocat.BusinessLogic.Services.User
{
    public interface IUserService
    {
        Task<string> SignUp(SignUpModel model);
        Task<string> SignIn(SignInModel model);
        Task<Domain.User> GetCurrentUser(ClaimsPrincipal currentUser);
    }
}