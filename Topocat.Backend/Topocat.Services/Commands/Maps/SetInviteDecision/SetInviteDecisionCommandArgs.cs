namespace Topocat.Services.Commands.Maps.SetInviteDecision
{
    public class SetInviteDecisionCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public bool Accept { get; set; }
    }
}