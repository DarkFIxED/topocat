using System;
using Topocat.Domain.Entities.Map;

namespace Topocat.Services.Queries.Map.GetMapMemberships
{
    public class GetMapMembershipsQueryResultItem
    {
        public string Id { get; set; }

        public string InvitedEmail { get; set; }

        public MapMembershipStatus Status { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}