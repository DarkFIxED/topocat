namespace Topocat.Services.Commands.Maps.Memberships.ResendInvite
{
    public class ResendInviteCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string InviteId { get; set; }
    }
}