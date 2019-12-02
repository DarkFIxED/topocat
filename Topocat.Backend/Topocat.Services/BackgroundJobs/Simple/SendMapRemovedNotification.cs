using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Topocat.Common;
using Topocat.Services.Hubs;
using Topocat.Services.Services.Background;

namespace Topocat.Services.BackgroundJobs.Simple
{
    [RegisterScoped]
    public class SendMapRemovedNotification : SimpleBackgroundTask<string>
    {
        private const string MethodName = "MapRemoved";

        private readonly IHubContext<MapHub> _mapHubContext;

        public SendMapRemovedNotification(IHubContext<MapHub> mapHubContext)
        {
            _mapHubContext = mapHubContext;
        }

        public override async Task Run(string args)
        {
            await _mapHubContext.Clients.Group(args).SendAsync(MethodName, args);
        }
    }
}