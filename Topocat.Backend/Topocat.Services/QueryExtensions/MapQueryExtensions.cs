using System.Collections.Generic;
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
            return query.Include(x => x.ObjectsList);
        }

        public static IQueryable<Map> WithAccessOf(this IQueryable<Map> query, string actionExecutorId)
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
                Objects = new List<MapObjectModel>()
            });
        }
    }
}