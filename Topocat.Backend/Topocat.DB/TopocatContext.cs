using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.Domain;
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

        public IEnumerable<IDomainEvent> GetDomainEvents()
        {
            return ChangeTracker.Entries()
                .Select(x => x.Entity)
                .OfType<IHasDomainEvents>()
                .Where(x => x.Events.Any())
                .SelectMany(x => x.Events);
        }
    }
}