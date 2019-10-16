using Topocat.Domain.Types;

namespace Topocat.Services.Commands.Maps.AddLine
{
    public class AddLineCommandArgs
    {
        public string ActionExecutorId { get; set; }
        public string MapId { get; set; }
        public string Title { get; set; }
        public Coordinates Start { get; set; }
        public Coordinates End { get; set; }
    }
}