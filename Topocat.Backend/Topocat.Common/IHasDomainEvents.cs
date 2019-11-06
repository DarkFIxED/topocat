using System.Collections.Generic;

namespace Topocat.Common
{
    public interface IHasDomainEvents
    {
        IEnumerable<IDomainEvent> Events { get; }
    }
}