using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Entities.Map;
using Topocat.Services.Models;

namespace Topocat.Services.QueryExtensions
{
    public static class MapQueryExtensions
    {
        public static IQueryable<Map> LoadAggregate(this IQueryable<Map> query)
        {
            return query.Include(x => x.ObjectsList)
                .Include(x => x.Memberships);
        }

        public static IQueryable<Map> WithAccessOf(this IQueryable<Map> query, string actionExecutorId)
        {
            return query.Where(x => x.Memberships.Any(y => y.InvitedId == actionExecutorId && y.Status == MapMembershipStatus.Accepted));
        }

        public static IQueryable<Map> WithAdminPermissions(this IQueryable<Map> query, string actionExecutorId)
        {
            return query.Where(x => x.CreatedById == actionExecutorId);
        }

        public static IQueryable<MapModel> ToMapModels(this IQueryable<Map> query)
        {
            return query.Select(x => new MapModel
            {
                Id = x.Id,
                Title = x.Title,
                CreatedAt = x.CreatedAt,
                LastModifiedAt = x.LastModifiedAt,
                Objects = x.ObjectsList.Select(o => new MapObjectModel
                {
                    Title = o.Title,
                    Id = o.Id,
                    LastModifiedAt = o.LastModifiedAt,
                    CreatedAt = o.CreatedAt,
                    GeoJson = o.Geometry.AsText()
                }).ToList()
            });
        }
    }
}