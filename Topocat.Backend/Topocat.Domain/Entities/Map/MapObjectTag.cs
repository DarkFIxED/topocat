using System;
using Topocat.Common;
using Topocat.Domain.DomainEvents;

namespace Topocat.Domain.Entities.Map
{
    public class MapObjectTag : DomainEntity, IMarkAsRemoved, IHasIdentifier<string>
    {
        protected MapObjectTag() { }

        public MapObjectTag(MapObject mapObject, string tag)
        {
            Id = Guid.NewGuid().ToString("D");

            ObjectId = mapObject.Id;
            Object = mapObject;
            Tag = tag.Trim();
        }

        public string Id { get; protected set; }
     
        public MapObject Object { get; protected set; }

        public string ObjectId { get; protected set; }

        public string Tag { get; protected set; }

        public void MarkAsRemoved()
        {
            AddEvent(new EntityRemoved(this));
        }
    }
}