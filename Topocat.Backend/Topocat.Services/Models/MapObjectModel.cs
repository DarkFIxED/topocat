using System;
using System.Collections.Generic;
using Topocat.Domain.Types;

namespace Topocat.Services.Models
{
    public class MapObjectModel
    {
        public string Id { get; set; }

        public string Type { get; set; }

        public string Title { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset LastModifiedAt { get; set; }

        public IEnumerable<Coordinates> Coordinates { get; set; }

    }
}