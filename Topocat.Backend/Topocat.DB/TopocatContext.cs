using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Users;

namespace Topocat.DB
{
    public class TopocatContext : IdentityDbContext<User, Role, string>
    {
        public TopocatContext(DbContextOptions options) : base(options)
        {
        }
    }
}
