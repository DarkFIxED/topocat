using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Topocat.Common;
using Topocat.Services.Hubs;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.BackgroundJobs.Simple
{
    [RegisterScoped]
    public class SendObjectAddedNotification : SimpleBackgroundTask<string, MapObjectModel>
    {
        private readonly IHubContext<MapHub> _mapHubContext;

        public SendObjectAddedNotification(IHubContext<MapHub> mapHubContext)
        {
            _mapHubContext = mapHubContext;
        }

        public override async Task Run(string args1, MapObjectModel args2)
        {
            await _mapHubContext.Clients.Group(args1).SendAsync("ObjectAdded", args2);
        }
    }
}