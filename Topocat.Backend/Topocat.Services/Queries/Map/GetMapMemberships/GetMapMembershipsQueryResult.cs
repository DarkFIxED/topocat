using System.Collections.Generic;

namespace Topocat.Services.Queries.Map.GetMapMemberships
{
    public class GetMapMembershipsQueryResult
    {
        public IEnumerable<GetMapMembershipsQueryResultItem> Memberships { get; set; }
    }
}