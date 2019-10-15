using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.Domain.Users;

namespace Topocat.Domain.Map
{
    public class Map : DomainEntity, IHasIdentifier<string>, ICreatedAt, ILastModifiedAt, IAggregationRoot
    {
        public IEnumerable<MapObject> Objects => ObjectsList;

        [UsedImplicitly]
        protected Map() { }

        public Map(User creator, string title)
        {
            Id = Guid.NewGuid().ToString("D");

            CreatedAt = DateTimeOffset.UtcNow;
            LastModifiedAt = CreatedAt;

            CreatedBy = creator;
            CreatedById = creator.Id;

            Title = title;
            ObjectsList = new List<MapObject>();
        }

        public string Id { get; protected set; }

        public string Title { get; protected set; }

        public string CreatedById { get; protected set; }

        [ForeignKey(nameof(CreatedById))]
        public User CreatedBy { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public DateTimeOffset LastModifiedAt { get; protected set; }

        protected internal IList<MapObject> ObjectsList { get; set; }

        public void Add(MapObject mapObject)
        {
            ObjectsList.Add(mapObject);

            LastModifiedAt = DateTimeOffset.UtcNow;
        }

        public void SetTitle(string newTitle)
        {
            Title = newTitle;

            LastModifiedAt = DateTimeOffset.UtcNow;
        }
    }
}
