using JetBrains.Annotations;
using Topocat.Domain.Types;

namespace Topocat.Domain.Entities.Map.Objects
{
    public class Line : MapObject
    {
        [UsedImplicitly]
        protected Line() { }

        public Line(Map map, string title, double startLatitude, double startLongitude, double endLatitude, double endLongitude) : base(map, title)
        {
            Start = new Coordinates(startLatitude, startLongitude);
            End = new Coordinates(endLatitude, endLongitude);
        }

        public Line(Map map, string title, Coordinates start, Coordinates end) : base(map, title)
        {
            Start = start;
            End = end;
        }

        public Coordinates Start { get; protected set; }

        public Coordinates End { get; protected set; }
    }
}