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

namespace Topocat.Services.Commands.Maps.Memberships.CancelInvite
{
    [RegisterScoped]
    public class CancelInviteCommand : ICommand<CancelInviteCommandArgs>
    {
        private readonly UserManager<User> _userManager;

        private readonly IRepository _repository;

        public CancelInviteCommand(UserManager<User> userManager, IRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }

        public async Task Execute(CancelInviteCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            var map = await _repository.AsQueryable<Map>()
                .NotRemoved()
                .WithAdminPermissions(actionExecutor.Id)
                .WithId(args.MapId)
                .LoadAggregate()
                .FirstOrDefaultAsync();

            if (map == null)
                throw new ServiceException("Map not found");

            var existingMembership = map.Memberships.FirstOrDefault(x => x.Id == args.InviteId);

            if (existingMembership == null)
                throw new ServiceException("Invite not found");

            map.CancelInvite(existingMembership);

            _repository.Update(map);

            await _repository.SaveAsync();
        }
    }
}