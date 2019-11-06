using System.Threading.Tasks;

namespace Topocat.Services.Hubs
{
    public interface IMapClient
    {
        Task Initialize(string mapId);

    }
}