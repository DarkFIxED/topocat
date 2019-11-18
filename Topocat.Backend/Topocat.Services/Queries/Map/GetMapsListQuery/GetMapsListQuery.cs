using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Models;

namespace Topocat.Services.Queries.Map.GetMapsListQuery
{
    [RegisterScoped]
    public class GetMapsListQuery : IQuery<GetMapsListQueryArgs, GetMapsListQueryResult>
    {
        private readonly IRepository _repository;

        private readonly UserManager<User> _userManager;

        public GetMapsListQuery(IRepository repository, UserManager<User> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task<GetMapsListQueryResult> Ask(GetMapsListQueryArgs args)
        {
            var user = await _userManager.FindByIdAsync(args.ActionExecutorId);
            if (user == null)
                throw new ArgumentNullException(nameof(user), "User not found");

            var items = await _repository.AsQueryable<Domain.Entities.Map.Map>()
                .Where(x => x.Memberships.Any(m => m.InvitedId == user.Id && m.Status == MapMembershipStatus.Accepted))
                .Select(x => new GetMapsListResultItem
                {
                    Id = x.Id,
                    CreatedAt = x.CreatedAt,
                    LastModifiedAt = x.LastModifiedAt,
                    Title = x.Title,
                    CreatedBy = new UserModel
                    {
                        Id = x.CreatedBy.Id,
                        Email = x.CreatedBy.Email
                    }
                })
                .ToListAsync();

            return new GetMapsListQueryResult
            {
                Maps = items
            };
        }
    }
}