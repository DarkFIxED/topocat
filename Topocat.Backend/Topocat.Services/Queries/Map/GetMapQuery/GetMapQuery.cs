using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map.Objects;
using Topocat.Domain.Types;
using Topocat.Services.Models;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Queries.Map.GetMapQuery
{
    [RegisterScoped]
    public class GetMapQuery : IQuery<GetMapQueryArgs, GetMapQueryResult>
    {
        private readonly IRepository _repository;

        public GetMapQuery(IRepository repository)
        {
            _repository = repository;
        }
        
        public async Task<GetMapQueryResult> Ask(GetMapQueryArgs args)
        {
            var mapModel = await _repository.AsQueryable<Domain.Entities.Map.Map>()
                .AsNoTracking()
                .WithId(args.MapId)
                .WithAccessOf(args.ActionExecutorId)
                .ToMapModels()
                .FirstOrDefaultAsync();

            if (mapModel == null)
                return new GetMapQueryResult();

            var linesQuery = await _repository.AsQueryable<Line>()
                .AsNoTracking()
                .Where(x => x.MapId == args.MapId)
                .Select(x => new
                {
                    x.Id,
                    x.CreatedAt,
                    x.LastModifiedAt,
                    x.Title,
                    Type = "Line",
                    x.Start,
                    x.End
                })
                .ToListAsync();

            var lines = linesQuery
                .Select(x => new MapObjectModel
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    LastModifiedAt = x.LastModifiedAt,
                    Title = x.Title,
                    Type = x.Type,
                    Coordinates = new List<Coordinates> {x.Start, x.End}
                }).ToList();

            var pointsQuery = await _repository.AsQueryable<Point>()
                .AsNoTracking()
                .Where(x => x.MapId == args.MapId)
                .Select(x => new
                {
                    x.Id,
                    x.CreatedAt,
                    x.LastModifiedAt,
                    x.Title,
                    Type = "Point",
                    x.Coordinates
                })
                .ToListAsync();

            var points = pointsQuery.Select(x => new MapObjectModel
            {
                Id = x.Id,
                CreatedAt = x.CreatedAt,
                LastModifiedAt = x.LastModifiedAt,
                Title = x.Title,
                Type = "Point",
                Coordinates = new List<Coordinates> {x.Coordinates}
            }).ToList();

            mapModel.Objects.AddRange(points);
            mapModel.Objects.AddRange(lines);

            return new GetMapQueryResult
            {
                Map = mapModel
            };
        }
    }
}