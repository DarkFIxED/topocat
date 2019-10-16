using System.Linq;
using Microsoft.EntityFrameworkCore;
using Topocat.Domain.Entities.Map;

namespace Topocat.QueryExtensions
{
    public static class MapQueryExtensions
    {
        public static IQueryable<Map> LoadAggregate(this IQueryable<Map> query)
        {
            return query.Include(x => x.ObjectsList);
        }
    }
}