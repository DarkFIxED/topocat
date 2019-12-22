using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Users;

namespace Topocat.Services.Queries.Map.CanUseProvider
{
    [RegisterScoped]
    public class CanUseProviderQuery : IQuery<CanUseProviderQueryArgs, CanUseProviderQueryResult>
    {
        private readonly IRepository _repository;

        public CanUseProviderQuery(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<CanUseProviderQueryResult> Ask(CanUseProviderQueryArgs args)
        {
            var availableMapProviders = await _repository.AsQueryable<AvailableMapProviders>()
                .Where(x => x.UserId == args.ActionExecutorId)
                .FirstOrDefaultAsync();


            if (availableMapProviders == null)
                throw new ArgumentNullException(nameof(availableMapProviders));

            switch (args.ProviderName.ToLower())
            {
                case "google":
                    return new CanUseProviderQueryResult
                    {
                        UsageApproved = availableMapProviders.Google
                    };

                case "yandex":
                    return new CanUseProviderQueryResult
                    {
                        UsageApproved = availableMapProviders.Yandex
                    };

                default:
                    throw new ArgumentOutOfRangeException(nameof(args.ProviderName));
            }
        }
    }
}