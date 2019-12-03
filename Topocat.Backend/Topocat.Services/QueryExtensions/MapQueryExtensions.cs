using System.Linq;
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

        public static IQueryable<Map> LoadAttachments(this IQueryable<Map> query)
        {
            return query.Include(x => x.ObjectsList)
                .ThenInclude(x => x.FileReferencesBindings)
                .ThenInclude(x => x.FileReference);
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
                CreatedBy = new UserModel
                {
                    Id = x.CreatedBy.Id,
                    Email = x.CreatedBy.Email
                }
            });
        }

        public static IQueryable<Map> NotRemoved(this IQueryable<Map> query)
        {
            return query.Where(x => !x.IsRemoved);
        }

        public static IQueryable<Map> Removed(this IQueryable<Map> query)
        {
            return query.Where(x => x.IsRemoved);
        }
    }
}