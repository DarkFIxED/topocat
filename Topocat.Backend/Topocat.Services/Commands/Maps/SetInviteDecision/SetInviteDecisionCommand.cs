using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.SetInviteDecision
{
    [RegisterScoped]
    public class SetInviteDecisionCommand : ICommand<SetInviteDecisionCommandArgs>
    {
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;

        public SetInviteDecisionCommand(IRepository repository, UserManager<User> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task Execute(SetInviteDecisionCommandArgs args)
        {
            var map = await _repository.AsQueryable<Map>()
                .WithId(args.MapId)
                .LoadAggregate()
                .FirstOrDefaultAsync();

            if (map == null) 
                throw new ServiceException("Map not found");

            var membership = map.Memberships.FirstOrDefault(x => x.Id == args.InviteId);

            if (membership == null)
                throw new ServiceException("Membership not found");

            if (membership.Status != MapMembershipStatus.DecisionNotMade)
                throw new ServiceException("Decision was already made");

            var actionExecutor = await _userManager.FindByIdAsync(membership.InvitedId);

            if (actionExecutor == null)
                throw new ArgumentException("User not found", nameof(actionExecutor));

            membership.SetDecision(actionExecutor, args.Accept 
                ? MapMembershipStatus.Accepted 
                : MapMembershipStatus.Declined);

            _repository.Update(membership);

            await _repository.SaveAsync();
        }
    }
}