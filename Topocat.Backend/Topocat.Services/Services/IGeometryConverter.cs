using NetTopologySuite.Geometries;

namespace Topocat.Services.Services
{
    public interface IGeometryConverter
    {
        Geometry FromWktString(string wktString);
    }
}