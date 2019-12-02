using Hangfire;
using Topocat.Common;

namespace Topocat.Services.Services.Background
{
    [RegisterScoped(typeof(IBackgroundService))]
    public class BackgroundService : IBackgroundService
    {
        public void RunInBackground<T, TArgs>(TArgs args) where T : SimpleBackgroundTask<TArgs>
        {
            BackgroundJob.Enqueue<T>(task => task.Run(args));
        }

        public void RunInBackground<T, TArgs1, TArgs2>(TArgs1 args1, TArgs2 args2) where T : SimpleBackgroundTask<TArgs1, TArgs2>
        {
            BackgroundJob.Enqueue<T>(task => task.Run(args1, args2));
        }
    }
}