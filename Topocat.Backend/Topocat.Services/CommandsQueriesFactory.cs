using System;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;

namespace Topocat.Services
{
    [RegisterScoped(typeof(ICommandsFactory))]
    [RegisterScoped(typeof(IQueriesFactory))]
    public class CommandsQueriesFactory : ICommandsFactory, IQueriesFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public CommandsQueriesFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        T IQueriesFactory.Get<T>()
        {
            return _serviceProvider.GetService<T>();
        }

        T ICommandsFactory.Get<T>()
        {
            return _serviceProvider.GetService<T>();
        }
    }
}