using System;

namespace Topocat.Common
{
    public interface ILastModifiedAt
    {
        DateTimeOffset LastModifiedAt { get; }
    }
}