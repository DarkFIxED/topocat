using System;
using Topocat.Services.Models;

namespace Topocat.Services.Queries.Map.GetMapsListQuery
{
    public class GetMapsListResultItem 
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset LastModifiedAt { get; set; }

        public UserModel CreatedBy { get; set; }
    }
}
