using System;
using Topocat.Common;
using Topocat.Common.DomainEventsDispatcher;

namespace Topocat.Services
{
    [RegisterScoped(typeof(IDomainEventsDispatcher))]
    public class DomainEventsDispatcher : IDomainEventsDispatcher
    {
        private readonly IServiceProvider _serviceProvider;

        public DomainEventsDispatcher(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public void Dispatch<T>(T @event) where T : IDomainEvent
        {
            var genericHandlerType = typeof(IDomainEventHandler<>);
            var handlerType = genericHandlerType.MakeGenericType(@event.GetType());

            var handler = (dynamic)_serviceProvider.GetService(handlerType);
            if (handler == null)
                return;

            handler.Handle((dynamic)@event);
        }
    }
}