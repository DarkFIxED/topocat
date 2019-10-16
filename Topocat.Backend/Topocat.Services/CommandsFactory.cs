using System;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;

namespace Topocat.Services
{
    [RegisterScoped(typeof(ICommandsFactory))]
    public class CommandsFactory : ICommandsFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public CommandsFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public T Get<T>() where T : ICommand
        {
            return _serviceProvider.GetService<T>();
        }
    }
}