using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;

namespace Topocat.Domain.Types
{
    [Owned]
    public class Coordinates
    {
        [UsedImplicitly]
        public Coordinates() {}

        public Coordinates(double latitude, double longitude)
        {
            Latitude = latitude;
            Longitude = longitude;
        }

        public double Latitude { get; set; }

        public double Longitude { get; set; }
    }
}