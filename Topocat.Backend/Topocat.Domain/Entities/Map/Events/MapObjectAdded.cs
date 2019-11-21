using Topocat.Common;

namespace Topocat.Domain.Entities.Map.Events
{
    public class MapObjectAdded : IDomainEvent
    {
        public MapObject MapObject;

        public MapObjectAdded(MapObject entity)
        {
            MapObject = entity;
        }
    }
}