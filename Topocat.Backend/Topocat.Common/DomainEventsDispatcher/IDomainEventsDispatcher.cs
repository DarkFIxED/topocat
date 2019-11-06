namespace Topocat.Common.DomainEventsDispatcher
{
    public interface IDomainEventsDispatcher
    {
        void Dispatch<T>(T @event) where T : IDomainEvent;
    }
}