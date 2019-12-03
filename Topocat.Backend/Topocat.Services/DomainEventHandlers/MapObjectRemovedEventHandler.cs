using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Services.BackgroundJobs.Simple;
using Topocat.Services.Services.Background;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectRemoved>))]
    public class MapObjectRemovedEventHandler : IDomainEventHandler<MapObjectRemoved>
    {
        private readonly IBackgroundService _backgroundService;

        public MapObjectRemovedEventHandler(IBackgroundService backgroundService)
        {
            _backgroundService = backgroundService;
        }

        public void Handle(MapObjectRemoved @event)
        {
            _backgroundService.RunInBackground<SendObjectRemovedNotification, string, string>(@event.MapId, @event.ObjectId);
        }
    }
}