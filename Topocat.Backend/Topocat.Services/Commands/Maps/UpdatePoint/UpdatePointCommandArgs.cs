using Topocat.Domain.Types;

namespace Topocat.Services.Commands.Maps.UpdatePoint
{
    public class UpdatePointCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string PointId { get; set; }

        public string Title { get; set; }

        public Coordinates Coordinates { get; set; }
    }
}