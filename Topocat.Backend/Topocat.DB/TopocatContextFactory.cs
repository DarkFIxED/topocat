using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Topocat.DB
{
    [UsedImplicitly]
    public class TopocatContextFactory : IDesignTimeDbContextFactory<TopocatContext>
    {
        public TopocatContext CreateDbContext(string[] args)
        {
            var configBuilder = new ConfigurationBuilder();
            configBuilder.AddJsonFile("appsettings.json", true, true);
            configBuilder.AddUserSecrets("f9d94ab4-1878-461c-b642-9c884dadb5aa");
            var config = configBuilder.Build();

            var optionsBuilder = new DbContextOptionsBuilder<TopocatContext>();
            optionsBuilder.UseSqlServer(config.GetConnectionString("Database"), x => x.UseNetTopologySuite());

            return new TopocatContext(optionsBuilder.Options);
        }
    }
}