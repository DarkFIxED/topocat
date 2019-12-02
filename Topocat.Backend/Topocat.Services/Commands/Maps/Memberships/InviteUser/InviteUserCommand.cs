using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Emails;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Maps.Memberships.InviteUser
{
    [RegisterScoped]
    public class InviteUserCommand : ICommand<InviteUserCommandArgs>
    {
        private readonly IRepository _repository;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly EmailMessageFactory _emailMessageFactory;

        public InviteUserCommand(IRepository repository, UserManager<User> userManager, IEmailService emailService, EmailMessageFactory emailMessageFactory)
        {
            _repository = repository;
            _userManager = userManager;
            _emailService = emailService;
            _emailMessageFactory = emailMessageFactory;
        }

        public async Task Execute(InviteUserCommandArgs args)
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

            var invitedUser = await _userManager.FindByEmailAsync(args.InvitedEmail);
            if (invitedUser == null)
            {
                invitedUser = new User(args.InvitedEmail);
                await _userManager.CreateAsync(invitedUser);
            }

            var notificationSettings = await _repository.AsQueryable<UserNotificationSettings>()
                .Where(x => x.UserId == invitedUser.Id)
                .FirstAsync();

            var newMembership = map.Invite(actionExecutor, invitedUser);

            _repository.Update(map);

            await _repository.SaveAsync();

            if (notificationSettings.NotifyAboutNewInvites)
            {
                var emailArgs = new MapInviteEmailTemplateArgs
                {
                    Address = invitedUser.Email,
                    MapId = map.Id,
                    InviteId = newMembership.Id
                };

                var message = _emailMessageFactory.Get<MapInviteEmailTemplate, MapInviteEmailTemplateArgs>(emailArgs);
                _emailService.SendEmail(message);
            }
        }
    }
}