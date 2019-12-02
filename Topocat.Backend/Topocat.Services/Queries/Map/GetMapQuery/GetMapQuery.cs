using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
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
            var result = await _repository.AsQueryable<Domain.Entities.Map.Map>()
                .NotRemoved()
                .WithId(args.MapId)
                .WithAccessOf(args.ActionExecutorId)
                .ToMapModels()
                .FirstOrDefaultAsync();

            return new GetMapQueryResult
            {
                Map = result
            };
        }
    }
}