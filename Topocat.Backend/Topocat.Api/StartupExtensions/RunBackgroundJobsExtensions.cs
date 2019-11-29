using Hangfire;
using Microsoft.AspNetCore.Builder;
using Topocat.Services.BackgroundJobs;

namespace Topocat.API.StartupExtensions
{
    public static class RunBackgroundJobsExtensions
    {
        public static void RunBackgroundJobs(this IApplicationBuilder app)
        {
            RecurringJob.AddOrUpdate<CleanUpUnconfirmedFileReferences>(job => job.Run(), Cron.Daily);
        }
    }
}