using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using SimpleInjector;
using Topocat.BusinessLogic.User;

namespace Topocat.Api.AppHelpers
{
    public static class DiRegistrations
    {
        public static void Register(IApplicationBuilder app, Container container)
        {
            RegisterDAL(container);
            RegisterServices(container);
            RegisterCommon(app, container);
        }

        private static void RegisterDAL(Container container)
        {
            //container.Register(() =>
            //{
            //    var options = new DbContextOptions<TopocatDbContext>();
            //    return new TopocatDbContext(options);
            //});
        }

        private static void RegisterServices(Container container)
        {
            container.Register<IUserService, UserService>();
        }

        private static void RegisterCommon(IApplicationBuilder app, Container container)
        {
            container.CrossWire<UserManager<Domain.User>>(app); 
            container.CrossWire<SignInManager<Domain.User>>(app);
        }
    }
}
