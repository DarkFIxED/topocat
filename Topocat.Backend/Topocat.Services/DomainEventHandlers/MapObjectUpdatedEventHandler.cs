using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Services.Hubs;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectUpdated>))]
    public class MapObjectUpdatedEventHandler : IDomainEventHandler<MapObjectUpdated>
    {
        private readonly IBackgroundTaskQueue _backgroundTaskQueue;

        public MapObjectUpdatedEventHandler(IBackgroundTaskQueue backgroundTaskQueue)
        {
            _backgroundTaskQueue = backgroundTaskQueue;
        }

        public void Handle(MapObjectUpdated @event)
        {
            async Task WorkItem(CancellationToken token, IServiceProvider provider)
            {
                var hubContext = provider.GetService<IHubContext<MapHub>>();
                var mapObjectModel = new MapObjectModel
                {
                    Id = @event.MapObject.Id,
                    CreatedAt = @event.MapObject.CreatedAt,
                    LastModifiedAt = @event.MapObject.LastModifiedAt,
                    Title = @event.MapObject.Title,
                    WktString = @event.MapObject.Geometry.ToString()
                };

                await hubContext.Clients.Group(@event.MapObject.MapId).SendAsync("ObjectUpdated", mapObjectModel, token);
            }

            _backgroundTaskQueue.QueueBackgroundWorkItem(WorkItem);
        }
    }
}