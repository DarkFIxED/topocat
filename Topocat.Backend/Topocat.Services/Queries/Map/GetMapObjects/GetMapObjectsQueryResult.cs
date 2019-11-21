using System.Collections.Generic;
using Topocat.Services.Models;

namespace Topocat.Services.Queries.Map.GetMapObjects
{
    public class GetMapObjectsQueryResult
    {
        public IEnumerable<MapObjectModel> MapObjects { get; set; }
    }
}