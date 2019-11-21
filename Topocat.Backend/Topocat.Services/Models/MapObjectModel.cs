using System;

namespace Topocat.Services.Models
{
    public class MapObjectModel
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset LastModifiedAt { get; set; }

        public string WktString { get; set; }
    }
}