using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Map;
using Topocat.Domain.Map.Objects;
using Topocat.Domain.Users;

namespace Topocat.DB
{
    public class TopocatContext : IdentityDbContext<User, Role, string>
    {
        public TopocatContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Map> Maps { get; set; }

        public DbSet<Line> Lines { get; set; }

        public DbSet<Point> Points { get; set; }
    }
}
