using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectAdded>))]
    public class MapObjectAddedEventHandler : IDomainEventHandler<MapObjectAdded>
    {
        public void Handle(MapObjectAdded @event)
        {
            
        }
    }
}