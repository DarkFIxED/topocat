using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Topocat.Common;
using Topocat.Services.Hubs;
using Topocat.Services.Services.Background;

namespace Topocat.Services.BackgroundJobs.Simple
{
    [RegisterScoped]
    public class SendObjectRemovedNotification : SimpleBackgroundTask<string, string>
    {
        private const string MethodName = "ObjectRemoved";

        private readonly IHubContext<MapHub> _mapHubContext;

        public SendObjectRemovedNotification(IHubContext<MapHub> mapHubContext)
        {
            _mapHubContext = mapHubContext;
        }

        public override async Task Run(string args1, string args2)
        {
            await _mapHubContext.Clients.Group(args1).SendAsync(MethodName, args2);
        }
    }
}