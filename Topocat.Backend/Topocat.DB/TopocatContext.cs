using System.Collections.Generic;
using System.Linq;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.Domain.Entities.Files;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;

namespace Topocat.DB
{
    public class TopocatContext : IdentityDbContext<User, Role, string>
    {
        public TopocatContext(DbContextOptions options) : base(options)
        {
        }

        [UsedImplicitly]
        public DbSet<Map> Maps { get; set; }

        [UsedImplicitly]
        public DbSet<MapObject> MapObjects { get; set; }

        [UsedImplicitly]
        public DbSet<MapObjectFileReferences> MapObjectFileReferences { get; set; }

        [UsedImplicitly]
        public DbSet<MapObjectTag> MapObjectTags { get; set; }

        [UsedImplicitly]
        public DbSet<FileReference> FileReferences { get; set; }

        [UsedImplicitly]
        public DbSet<AvailableMapProviders> AvailableMapProviders { get; set; }

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