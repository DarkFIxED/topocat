using Topocat.Common;

namespace Topocat.Domain.Entities.Map.Events
{
    public class MapRemoved : IDomainEvent
    {
        public string MapId { get; set; }

        public MapRemoved(Map map)
        {
            MapId = map.Id;
        }
    }
}