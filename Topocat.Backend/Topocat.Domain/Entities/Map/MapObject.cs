using System;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;
using Topocat.Common;

namespace Topocat.Domain.Entities.Map
{
    public abstract class MapObject : DomainEntity, IHasIdentifier<string>, ILastModifiedAt, ICreatedAt
    {
        [UsedImplicitly]
        protected MapObject() { }

        protected MapObject(Map map, string title)
        {
            Map = map;
            MapId = map.Id;
            
            Id = Guid.NewGuid().ToString("D");
            CreatedAt = DateTimeOffset.UtcNow;
            LastModifiedAt = DateTimeOffset.UtcNow;

            Title = title;
        }

        public string Id { get; protected set; }

        public string Title { get; protected set; }

        public DateTimeOffset LastModifiedAt { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public string MapId { get; protected set; }

        [ForeignKey(nameof(MapId))]
        public Map Map { get; protected set; }

        public void SetTitle(string newTitle)
        {
            Title = newTitle;
            LastModifiedAt = DateTimeOffset.UtcNow;
        }
    }
}