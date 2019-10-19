using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;

namespace Topocat.DB
{
    public class TopocatContext : IdentityDbContext<User, Role, string>
    {
        public TopocatContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Map> Maps { get; set; }

        public DbSet<MapObject> MapObjects { get; set; }
    }
}
