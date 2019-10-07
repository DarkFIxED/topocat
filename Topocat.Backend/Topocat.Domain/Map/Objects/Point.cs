using JetBrains.Annotations;
using Topocat.Domain.Types;

namespace Topocat.Domain.Map.Objects
{
    public class Point : MapObject
    {
        [UsedImplicitly]
        protected Point() { }

        public Point(string title, double latitude, double longitude): base(title)
        {
            Coordinates = new Coordinates(latitude, longitude);
        }

        public Coordinates Coordinates { get; protected set; }

    }
}
