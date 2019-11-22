namespace Topocat.Services.Commands.Maps.Memberships.CancelInvite
{
    public class CancelInviteCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string InviteId { get; set; }
    }
}