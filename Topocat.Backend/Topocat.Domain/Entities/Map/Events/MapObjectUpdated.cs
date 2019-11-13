using Topocat.Common;

namespace Topocat.Domain.Entities.Map.Events
{
    public class MapObjectUpdated : IDomainEvent
    {
        public MapObject MapObject { get; }

        public MapObjectUpdated(MapObject entity)
        {
            MapObject = entity;
        }
    }
}
