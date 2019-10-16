using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;

namespace Topocat.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterServicesByAttributes(this IServiceCollection service)
        {
            var allAssemblies = AppDomain.CurrentDomain.GetAssemblies();
            var relevantAssemblies = allAssemblies
                .Where(x => x.FullName.Contains("Topocat"));

            var types = relevantAssemblies.SelectMany(x => x.GetTypesWithAttribute<RegisterScopedAttribute>());

            foreach (var type in types)
            {
                var attributeInstance = type.GetCustomAttributes(typeof(RegisterScopedAttribute), false)
                    .Cast<RegisterScopedAttribute>()
                    .First();

                if (attributeInstance.RegisteredToSelf)
                    service.AddScoped(type);
                else
                    service.AddScoped(attributeInstance.AbstractionType, type);
            }
        }
    }
}