using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Services.Models;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Queries.Map.GetMapObjects
{
    [RegisterScoped]
    public class GetMapObjectsQuery : IQuery<GetMapObjectsQueryArgs, GetMapObjectsQueryResult>
    {
        private readonly IRepository _repository;

        public GetMapObjectsQuery(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetMapObjectsQueryResult> Ask(GetMapObjectsQueryArgs args)
        {
            var result = await _repository.AsQueryable<Domain.Entities.Map.Map>()
                .NotRemoved()
                .WithId(args.MapId)
                .WithAccessOf(args.ActionExecutorId)
                .SelectMany(x=>x.ObjectsList)
                .Select(x=>new MapObjectModel
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    LastModifiedAt = x.LastModifiedAt,
                    Title = x.Title,
                    WktString = x.Geometry.ToText()
                })
                .ToListAsync();

            return new GetMapObjectsQueryResult
            {
                MapObjects = result
            };
        }
    }
}