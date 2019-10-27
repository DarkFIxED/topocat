using System;
using JetBrains.Annotations;
using Topocat.Common;
using Topocat.Common.Extensions;
using Topocat.Domain.Entities.Users;
using Topocat.Domain.Exceptions;

namespace Topocat.Domain.Entities.Map
{
    public class MapMembership : IHasIdentifier<string>, ICreatedAt
    {
        public static MapMembership CreateOwnerMembership(Map map)
        {
            var membership =  new MapMembership(map.CreatedBy, map, map.CreatedBy);
            membership.SetDecision(map.CreatedBy, MapMembershipStatus.Accepted);

            return membership;
        }

        [UsedImplicitly]
        protected MapMembership () { }

        public MapMembership(User inviter, Map map, User invited)
        {
            Id = Guid.NewGuid().ToString("D");

            CreatedAt = DateTimeOffset.UtcNow;

            InviterId = inviter.Id;
            Inviter = inviter;

            MapId = map.Id;
            Map = map;

            InvitedId = invited.Id;
            Invited = invited;

            Status = MapMembershipStatus.DecisionNotMade;
        }

        public string Id { get; protected set; }

        public string InviterId { get; protected set; }

        public User Inviter { get; protected set; }

        public string MapId { get; protected set; }

        public Map Map { get; protected set; }

        public string InvitedId { get; protected set; }

        public User Invited { get; protected set; }

        public MapMembershipStatus Status { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public void SetDecision(User actionExecutor, MapMembershipStatus status)
        {
            if (actionExecutor.Id != Invited.Id)
                throw new InvalidOperationException("Only invited user can make decision.");

            if (Status != MapMembershipStatus.DecisionNotMade)
                throw new DomainException("Decision already made.");

            if (!status.In(MapMembershipStatus.Accepted, MapMembershipStatus.Declined))
                throw new ArgumentException("Only accepted or declined statuses allowed.");

            Status = status;
        }
    }
}
