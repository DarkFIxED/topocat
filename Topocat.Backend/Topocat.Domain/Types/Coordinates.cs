using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;

namespace Topocat.Domain.Types
{
    [Owned]
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