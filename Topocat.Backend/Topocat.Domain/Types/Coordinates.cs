using JetBrains.Annotations;

namespace Topocat.Domain.Types
{
    public class Coordinates
    {
        [UsedImplicitly]
        protected Coordinates() {}

        public Coordinates(double latitude, double longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }

        public double Latitude { get; protected set; }

        public double Longitude { get; protected set; }
    }
}