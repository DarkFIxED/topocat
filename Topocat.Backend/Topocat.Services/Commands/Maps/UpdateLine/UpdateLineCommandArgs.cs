using Topocat.Domain.Types;

namespace Topocat.Services.Commands.Maps.UpdateLine
{
    public class UpdateLineCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string LineId { get; set; }

        public string Title { get; set; }

        public Coordinates Start { get; set; }

        public Coordinates End { get; set; }
    }
}