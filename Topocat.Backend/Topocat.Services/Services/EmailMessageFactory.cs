using System;
using Microsoft.Extensions.DependencyInjection;
using Topocat.Common;
using Topocat.Services.Emails;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped]
    public class EmailMessageFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public EmailMessageFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public EmailMessage Get<T, TArgs>(TArgs args) where T : IEmailTemplate<TArgs> where TArgs : class
        {
            var template = _serviceProvider.GetService<T>();

            return template.Build(args);
        }
    }
}