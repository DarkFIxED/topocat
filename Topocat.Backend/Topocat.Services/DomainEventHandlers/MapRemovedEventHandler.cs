using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Services.BackgroundJobs.Simple;
using Topocat.Services.Services.Background;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapRemoved>))]
    public class MapRemovedEventHandler : IDomainEventHandler<MapRemoved>
    {
        private readonly IBackgroundService _backgroundService;

        public MapRemovedEventHandler(IBackgroundService backgroundService)
        {
            _backgroundService = backgroundService;
        }

        public void Handle(MapRemoved @event)
        {
            _backgroundService.RunInBackground<SendMapRemovedNotification, string>(@event.MapId);
        }
    }
}