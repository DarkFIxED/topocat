﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;
using Topocat.Common;
using Topocat.Domain.Entities.Users;
using Topocat.Domain.Exceptions;

namespace Topocat.Domain.Entities.Map
{
    public class Map : DomainEntity, IHasIdentifier<string>, ICreatedAt, ILastModifiedAt, IAggregationRoot
    {
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

        public List<MapObject> ObjectsList { get; set; }

        public void Add(MapObject mapObject)
        {
            ObjectsList.Add(mapObject);

            LastModifiedAt = DateTimeOffset.UtcNow;
        }

        public void SetTitle(string newTitle)
        {
            if (string.IsNullOrWhiteSpace(newTitle))
                throw new DomainException("Map title can not be empty");

            Title = newTitle;

            LastModifiedAt = DateTimeOffset.UtcNow;
        }

        public bool CanModify(User actionExecutor)
        {
            return actionExecutor.Id == CreatedById;
        }
    }
}
