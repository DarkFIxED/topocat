using System.Threading.Tasks;

namespace Topocat.Services.BackgroundJobs
{
    public interface IBackgroundJob
    {
        Task Run();
    }
}