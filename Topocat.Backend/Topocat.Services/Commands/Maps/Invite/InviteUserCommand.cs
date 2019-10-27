using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Maps.Invite
{
    public class InviteUserCommand : ICommand<InviteUserCommandArgs>
    {
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;

        public InviteUserCommand(IRepository repository, UserManager<User> userManager, IEmailService emailService)
        {
            _repository = repository;
            _userManager = userManager;
            _emailService = emailService;
        }

        public async Task Execute(InviteUserCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            var map = await _repository.AsQueryable<Map>()
                .Include(x => x.Memberships)
                .Include(x => x.CreatedBy)
                .WithId(args.MapId)
                .FirstAsync();

            var invitedUser = await _userManager.FindByEmailAsync(args.InvitedEmail);
            if (invitedUser == null)
            {
                invitedUser = new User(args.InvitedEmail);
                await _userManager.CreateAsync(invitedUser);
            }
            
            map.Invite(actionExecutor, invitedUser);

            _repository.Update(map);

            await _repository.SaveAsync();

            // TODO: create emails factory
            _emailService.SendEmail(invitedUser.Email, string.Empty);
        }
    }
}