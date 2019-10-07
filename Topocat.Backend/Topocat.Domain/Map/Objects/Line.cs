using JetBrains.Annotations;
using Topocat.Domain.Types;

namespace Topocat.Domain.Map.Objects
{
    public class Line : MapObject
    {
        [UsedImplicitly]
        protected Line() { }

        public Line(string title, double startLatitude, double startLongitude, double endLatitude, double endLongitude) : base(title)
        {
            Start = new Coordinates(startLatitude, startLongitude);
            End = new Coordinates(endLatitude, endLongitude);
        }

        public Coordinates Start { get; protected set; }

        public Coordinates End { get; protected set; }
    }
}