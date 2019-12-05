using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using JetBrains.Annotations;
using NetTopologySuite.Geometries;
using Topocat.Common;
using Topocat.Domain.DomainEvents;
using Topocat.Domain.Entities.Files;
using Topocat.Domain.Entities.Map.Events;

namespace Topocat.Domain.Entities.Map
{
    public class MapObject : DomainEntity, IHasIdentifier<string>, ILastModifiedAt, ICreatedAt, IMarkAsRemoved
    {
        [UsedImplicitly]
        protected MapObject() { }

        public MapObject(Map map, string title, string description, Geometry geometry, List<string> tags)
        {
            FileReferencesBindings = new List<MapObjectFileReferences>();
            Tags = new List<MapObjectTag>();

            AddEvent(new MapObjectAdded(this));

            Map = map;
            MapId = map.Id;
            
            Id = Guid.NewGuid().ToString("D");
            CreatedAt = DateTimeOffset.UtcNow;

            Update(title, description, geometry);
            ReplaceTags(tags);
        }

        public string Id { get; protected set; }

        public string Title { get; protected set; }

        public string Description { get; protected set; }

        public DateTimeOffset LastModifiedAt { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public string MapId { get; protected set; }

        [ForeignKey(nameof(MapId))]
        public Map Map { get; protected set; }

        public Geometry Geometry { get; protected set; }

        public List<MapObjectFileReferences> FileReferencesBindings { get; protected set; }

        public List<MapObjectTag> Tags { get; protected set; }

        public void Update(string title, string description, Geometry geometry)
        {
            Title = title;
            Description = description;
            Geometry = FixClockWiseOrientationIfRequired(geometry);
            LastModifiedAt = DateTimeOffset.UtcNow;

            if (!HasEventsOfType<MapObjectAdded>())
                AddOrReplaceEvent(new MapObjectUpdated(this));
        }

        public void MarkAsRemoved()
        {
            if (!HasEventsOfType<EntityRemoved>())
                AddOrReplaceEvent(new EntityRemoved(this));
        }
        
        public void AddAttachment(FileReference fileReference)
        {
            FileReferencesBindings.Add(new MapObjectFileReferences(this, fileReference));
        }

        public void ReplaceTags(List<string> tags)
        {
            var outdatedTags = Tags.Where(mapObjectTag => tags.All(tag => tag != mapObjectTag.Tag)).ToList();
            var actualTags = Tags.Except(outdatedTags);

            var newTags = tags.Where(tag => actualTags.All(actualTag => actualTag.Tag != tag)).Select(tagValue => new MapObjectTag(this, tagValue));

            outdatedTags.ForEach(outdatedTag =>
            {
                Tags.Remove(outdatedTag);
                outdatedTag.MarkAsRemoved();
            });

            Tags.AddRange(newTags);

            if (!HasEventsOfType<MapObjectAdded>())
                AddOrReplaceEvent(new MapObjectUpdated(this));
        }
        
        private static Geometry FixClockWiseOrientationIfRequired(Geometry geometry)
        {
            if (geometry.OgcGeometryType != OgcGeometryType.Polygon)
                return geometry;

            var polygon = geometry as Polygon;
            if (polygon == null)
                throw new InvalidCastException();

            if (!polygon.Shell.IsCCW)
                geometry = polygon.Reverse();

            return geometry;
        }

    }
}