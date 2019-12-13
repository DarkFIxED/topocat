using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Users;

namespace Topocat.Services.Queries.Map.GetAvailableMapProviders
{
    [RegisterScoped]
    public class GetAvailableMapProvidersQuery : IQuery<GetAvailableMapProvidersQueryArgs, GetAvailableMapProvidersQueryResult>
    {
        private readonly IRepository _repository;

        public GetAvailableMapProvidersQuery(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<GetAvailableMapProvidersQueryResult> Ask(GetAvailableMapProvidersQueryArgs args)
        {
            var availableMapProviders = await _repository.AsQueryable<AvailableMapProviders>()
                .Where(x => x.UserId == args.ActionExecutorId)
                .FirstOrDefaultAsync();


            if (availableMapProviders == null)
                throw new ArgumentNullException(nameof(availableMapProviders));

            return new GetAvailableMapProvidersQueryResult
            {
                Providers = new Dictionary<string, bool>(
                    new List<KeyValuePair<string, bool>>
                    {
                        new KeyValuePair<string, bool>("Google", availableMapProviders.Google),
                        new KeyValuePair<string, bool>("Yandex", availableMapProviders.Yandex),
                    })
            };
        }
    }
}