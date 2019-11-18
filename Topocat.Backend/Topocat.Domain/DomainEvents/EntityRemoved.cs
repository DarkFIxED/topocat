using Topocat.Common;

namespace Topocat.Domain.DomainEvents
{
    public class EntityRemoved : IDomainEvent
    {
        public DomainEntity Entity;

        public EntityRemoved(DomainEntity entity)
        {
            Entity = entity;
        }
    }
}
