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
            AppDomain.CurrentDomain.GetAssemblies()
                .Where(x => x.FullName.Contains("Topocat"))
                .SelectMany(x => x.GetTypesWithAttribute<RegisterScopedAttribute>())
                .ToList()
                .ForEach(type =>
                    type.GetCustomAttributes(typeof(RegisterScopedAttribute), false)
                        .Cast<RegisterScopedAttribute>()
                        .ToList()
                        .ForEach(attributeInstance =>
                        {
                            if (attributeInstance.RegisteredToSelf)
                                service.AddScoped(type);
                            else
                                service.AddScoped(attributeInstance.AbstractionType, type);
                        })
                );
        }
    }
}