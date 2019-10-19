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
            var config = configBuilder.Build();

            var optionsBuilder = new DbContextOptionsBuilder<TopocatContext>();
            optionsBuilder.UseSqlServer(config.GetConnectionString("Database"), x => x.UseNetTopologySuite());

            return new TopocatContext(optionsBuilder.Options);
        }
    }
}