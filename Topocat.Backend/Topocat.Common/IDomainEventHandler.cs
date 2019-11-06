namespace Topocat.Common
{
    public interface IDomainEventHandler<in T> where T: IDomainEvent
    {
        void Handle(T @event);
    }
}