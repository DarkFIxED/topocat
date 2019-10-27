namespace Topocat.Services.Commands.Maps.Invite
{
    public class InviteUserCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string InvitedEmail { get; set; }
    }
}
