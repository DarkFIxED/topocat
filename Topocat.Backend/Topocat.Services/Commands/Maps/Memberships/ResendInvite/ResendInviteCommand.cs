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

namespace Topocat.Services.Commands.Maps.Memberships.ResendInvite
{
    [RegisterScoped]
    public class ResendInviteCommand : ICommand<ResendInviteCommandArgs>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IEmailService _emailService;
        private readonly EmailMessageFactory _emailMessageFactory;

        public ResendInviteCommand(IRepository repository, UserManager<User> userManager, IEmailService emailService, EmailMessageFactory emailMessageFactory)
        {
            _repository = repository;
            _userManager = userManager;
            _emailService = emailService;
            _emailMessageFactory = emailMessageFactory;
        }

        public async Task Execute(ResendInviteCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            var map = await _repository.AsQueryable<Map>()
                .WithAdminPermissions(actionExecutor.Id)
                .WithId(args.MapId)
                .LoadAggregate()
                .FirstOrDefaultAsync();

            if (map == null)
                throw new ServiceException("Map not found");

            var existingMembership = map.Memberships.FirstOrDefault(x => x.Id == args.InviteId);
            if (existingMembership == null)
                throw new ServiceException("Invite not found");

            var invitedUser = await _userManager.FindByIdAsync(existingMembership.InvitedId);
            var notificationSettings = await _repository.AsQueryable<UserNotificationSettings>()
                .Where(x => x.UserId == invitedUser.Id)
                .FirstAsync();

            if (!notificationSettings.NotifyAboutNewInvites)
                return;

            var emailArgs = new MapInviteEmailTemplateArgs
            {
                Address = invitedUser.Email,
                MapId = map.Id,
                InviteId = existingMembership.Id
            };

            var message = _emailMessageFactory.Get<MapInviteEmailTemplate, MapInviteEmailTemplateArgs>(emailArgs);
            _emailService.SendEmail(message);
        }
    }
}