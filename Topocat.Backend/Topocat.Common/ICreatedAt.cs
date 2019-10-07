using System;

namespace Topocat.Common
{
    public interface ICreatedAt
    {
        DateTimeOffset CreatedAt { get; }
    }
}