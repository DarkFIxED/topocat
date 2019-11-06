using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectUpdated>))]
    public class MapObjectUpdatedEventHandler : IDomainEventHandler<MapObjectUpdated>
    {
        public void Handle(MapObjectUpdated @event)
        {
            
        }
    }
}