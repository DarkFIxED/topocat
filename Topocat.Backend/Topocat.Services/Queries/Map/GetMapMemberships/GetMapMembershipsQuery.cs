using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;

namespace Topocat.Services.Queries.Map.GetMapMemberships
{
    [RegisterScoped]
    public class GetMapMembershipsQuery : IQuery<GetMapMembershipsQueryArgs, GetMapMembershipsQueryResult>
    {
        private readonly IRepository _repository;

        public GetMapMembershipsQuery(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetMapMembershipsQueryResult> Ask(GetMapMembershipsQueryArgs args)
        {
            var items = await _repository.AsQueryable<MapMembership>()
                .Where(x => x.MapId == args.MapId)
                .Where(x => x.Map.CreatedById == args.ActionExecutorId)
                .Select(x => new GetMapMembershipsQueryResultItem
                {
                    Status = x.Status,
                    CreatedAt = x.CreatedAt,
                    InvitedEmail = x.Invited.Email
                })
                .ToListAsync();

            return new GetMapMembershipsQueryResult
            {
                Memberships = items
            };
        }
    }
}