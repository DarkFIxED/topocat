using System.Collections.Generic;

namespace Topocat.Services.Queries.Map.GetMapsListQuery
{
    public class GetMapsListQueryResult
    {
        public IEnumerable<GetMapsListResultItem> Maps { get; set; }
    }
}