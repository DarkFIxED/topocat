using Hangfire.Dashboard;

namespace Topocat.API.Filters
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();

            // Allow all authenticated users to see the Dashboard (potentially dangerous).
            return true; //httpContext.User.Identity.IsAuthenticated;
        }
    }
}