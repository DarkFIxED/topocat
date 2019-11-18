using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Services.Hubs;
using Topocat.Services.Services.Background;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectRemoved>))]
    public class MapObjectRemovedEventHandler : IDomainEventHandler<MapObjectRemoved>
    {
        private readonly IBackgroundTaskQueue _backgroundTaskQueue;

        public MapObjectRemovedEventHandler(IBackgroundTaskQueue backgroundTaskQueue)
        {
            _backgroundTaskQueue = backgroundTaskQueue;
        }

        public void Handle(MapObjectRemoved @event)
        {
            async Task WorkItem(CancellationToken token, IServiceProvider provider)
            {
                var hubContext = provider.GetService<IHubContext<MapHub>>();

                await hubContext.Clients.Group(@event.MapId).SendAsync("ObjectRemoved", @event.MapId, token);
            }

            _backgroundTaskQueue.QueueBackgroundWorkItem(WorkItem);
        }
    }
}