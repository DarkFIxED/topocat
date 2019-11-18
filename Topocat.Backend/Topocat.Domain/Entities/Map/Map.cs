using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using JetBrains.Annotations;
using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Domain.Entities.Users;
using Topocat.Domain.Exceptions;

namespace Topocat.Domain.Entities.Map
{
    public class Map : DomainEntity, IHasIdentifier<string>, ICreatedAt, ILastModifiedAt, IAggregationRoot
    {
        [UsedImplicitly]
        protected Map()
        {
        }

        public Map(User creator, string title)
        {
            Id = Guid.NewGuid().ToString("D");

            CreatedAt = DateTimeOffset.UtcNow;
            LastModifiedAt = CreatedAt;

            CreatedBy = creator;
            CreatedById = creator.Id;

            Title = title;
            ObjectsList = new List<MapObject>();

            Memberships = new List<MapMembership>
            {
                MapMembership.CreateOwnerMembership(this)
            };
        }

        public string Id { get; protected set; }

        public string Title { get; protected set; }

        public string CreatedById { get; protected set; }

        [ForeignKey(nameof(CreatedById))]
        public User CreatedBy { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public DateTimeOffset LastModifiedAt { get; protected set; }

        public List<MapObject> ObjectsList { get; protected set; }

        public List<MapMembership> Memberships { get; protected set; }

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

        public void Invite(User actionExecutor, User invitedUser)
        {
            if (actionExecutor.Id != CreatedById)
                throw new DomainException("Only creator can invite members");

            if (Memberships.Any(x => x.InvitedId == invitedUser.Id))
                throw new DomainException("Can not invite twice.");

            var membership = new MapMembership(actionExecutor, this, invitedUser);
            Memberships.Add(membership);
        }

        public void Delete(User actionExecutor, MapObject mapObject)
        {
            var foundMapObject = ObjectsList.FirstOrDefault(x => x == mapObject);
            if (foundMapObject == null)
                throw new ArgumentNullException(nameof(foundMapObject), "Object not found");

            if (Memberships.All(x => x.InvitedId != actionExecutor.Id))
                throw new DomainException("Have no access to map.");

            foundMapObject.MarkAsRemoved();
            ObjectsList.Remove(foundMapObject);
            AddEvent(new MapObjectRemoved(foundMapObject));
        }
    }
}