using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain;

namespace Topocat.DAL
{
    public class TopocatDbContext : IdentityDbContext<User>
    {
        public TopocatDbContext(DbContextOptions<TopocatDbContext> options)
            : base(options)
        {
        }
    }
}
