using System;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;
using NetTopologySuite.Geometries;
using Topocat.Common;

namespace Topocat.Domain.Entities.Map
{
    public class MapObject : DomainEntity, IHasIdentifier<string>, ILastModifiedAt, ICreatedAt
    {
        [UsedImplicitly]
        protected MapObject() { }

        public MapObject(Map map, string title, Geometry geometry)
        {
            Map = map;
            MapId = map.Id;
            
            Id = Guid.NewGuid().ToString("D");
            CreatedAt = DateTimeOffset.UtcNow;
            Update(title, geometry);
        }

        public string Id { get; protected set; }

        public string Title { get; protected set; }

        public DateTimeOffset LastModifiedAt { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public string MapId { get; protected set; }

        [ForeignKey(nameof(MapId))]
        public Map Map { get; protected set; }

        public Geometry Geometry { get; protected set; }

        public void Update(string title, Geometry geometry)
        {
            Title = title;
            Geometry = geometry;
            LastModifiedAt = DateTimeOffset.UtcNow;
        }
    }
}