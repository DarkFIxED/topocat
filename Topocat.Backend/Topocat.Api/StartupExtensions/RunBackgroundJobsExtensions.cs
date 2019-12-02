using Hangfire;
using Microsoft.AspNetCore.Builder;
using Topocat.Services.BackgroundJobs;

namespace Topocat.API.StartupExtensions
{
    public static class RunBackgroundJobsExtensions
    {
        public static void RunBackgroundJobs(this IApplicationBuilder _)
        {
            RecurringJob.AddOrUpdate<CleanUpRemovedMaps>(job => job.Run(), Cron.Daily);
            RecurringJob.AddOrUpdate<CleanUpUnconfirmedOrScheduledToRemoveFileReferences>(job => job.Run(), Cron.Daily(0, 30));
        }
    }
}