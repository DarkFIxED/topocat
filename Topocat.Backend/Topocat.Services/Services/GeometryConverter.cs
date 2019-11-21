using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using Topocat.Common;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IGeometryConverter))]
    public class GeometryConverter : IGeometryConverter
    {
        private const int Srid = 4326;

        private readonly GeometryFactory _geometryFactory;

        public GeometryConverter()
        {
            _geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(Srid);
        }

        public Geometry FromWktString(string wktString)
        {
            var reader = new WKTReader(_geometryFactory);
            return reader.Read(wktString);
        }
    }
}