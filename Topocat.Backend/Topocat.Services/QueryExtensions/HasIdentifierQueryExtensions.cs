using System.Linq;
using Topocat.Common;

namespace Topocat.Services.QueryExtensions
{
    public static class HasIdentifierQueryExtensions
    {
        public static IQueryable<TEntity> WithId<TEntity, TK>(this IQueryable<TEntity> query, TK key) where TEntity : IHasIdentifier<TK>
        {
            return query.Where(x => x.Id.Equals(key));
        }
    }
}