using Topocat.Domain.Types;

namespace Topocat.Services.Commands.Maps.AddPoint
{
    public class AddPointCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string Title { get; set; }

        public Coordinates Coordinates { get; set; }
    }
}