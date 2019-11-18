using Topocat.Common;

namespace Topocat.Domain.Entities.Map.Events
{
    public class MapObjectRemoved : IDomainEvent
    {
        public string ObjectId { get; set; }
        public string MapId { get; set; }

        public MapObjectRemoved(MapObject mapObject)
        {
            ObjectId = mapObject.Id;
            MapId = mapObject.MapId;
        }
    }
}