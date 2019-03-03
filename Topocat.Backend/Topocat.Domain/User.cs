using Microsoft.AspNetCore.Identity;

namespace Topocat.Domain
{
    public class User : IdentityUser
    {
        public string Login { get; set; }
    }
}
