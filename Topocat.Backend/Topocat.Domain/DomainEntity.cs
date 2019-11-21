using System.Collections.Generic;
using System.Linq;
using Topocat.Common;

namespace Topocat.Domain
{
    public abstract class DomainEntity : IDomainEntity, IHasDomainEvents
    {
        public IEnumerable<IDomainEvent> Events => _events;

        private readonly List<IDomainEvent> _events = new List<IDomainEvent>();

        protected void AddEvent(IDomainEvent @event)
        {
            _events.Add(@event);
        }

        protected void RemoveAllEvents()
        {
            _events.Clear();
        }

        protected void AddOrReplaceEvent<T>(T @event) where T : IDomainEvent
        {
            ReplaceEvent<T, T>(@event);
        }

        protected bool HasEventsOfType<T>() where T : IDomainEvent
        {
            return _events.OfType<T>().Any();
        }

        protected void ReplaceEvent<TOld, TNew>(TNew @event) where TOld: IDomainEvent where TNew : IDomainEvent
        {
            var existingEvent = _events.OfType<TOld>().FirstOrDefault();

            if (existingEvent != null)
            {
                _events.Remove(existingEvent);
            }

            AddEvent(@event);
        }
    }
}