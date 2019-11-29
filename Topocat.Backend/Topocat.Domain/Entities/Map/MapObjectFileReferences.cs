using System;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;
using Topocat.Common;
using Topocat.Domain.Entities.Files;

namespace Topocat.Domain.Entities.Map
{
    public class MapObjectFileReferences : DomainEntity, IHasIdentifier<string>
    {
        [UsedImplicitly]
        protected MapObjectFileReferences()
        {
        }

        public MapObjectFileReferences(MapObject mapObject, FileReference fileReference)
        {
            Id = Guid.NewGuid().ToString("D");

            MapObject = mapObject;
            MapObjectId = mapObject.Id;

            FileReference = fileReference;
            FileReferenceId = fileReference.Id;
        }

        public string Id { get; protected set; }

        public FileReference FileReference { get; protected set; }

        [ForeignKey(nameof(FileReference))]
        public string FileReferenceId { get; protected set; }

        public MapObject MapObject { get; protected set; }

        [ForeignKey(nameof(MapObject))]
        public string MapObjectId { get; set; }
    }
}
