using System.Linq;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Entities.Map;

namespace Topocat.Services.QueryExtensions
{
    public static class MapObjectExtensions
    {
        public static IQueryable<MapObject> OfMap(this IQueryable<MapObject> query, string mapId, string actionExecutorId)
        {
            return query.Where(x => x.MapId == mapId)
                .Where(x => !x.Map.IsRemoved)
                .Where(x => x.Map.Memberships.Any(membership => membership.InvitedId == actionExecutorId && membership.Status == MapMembershipStatus.Accepted));
        }

        public static IQueryable<MapObject> WithAttachments(this IQueryable<MapObject> query)
        {
            return query.Include(x => x.FileReferencesBindings)
                .ThenInclude(x => x.FileReference);
        }
    }
}