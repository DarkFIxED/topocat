using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.Services;
using Topocat.Services.Queries.Map.CanUseProvider;
using Topocat.Services.Queries.Map.GetAvailableMapProviders;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapProvidersController : ControllerBase
    {
        private readonly IQueriesFactory _queriesFactory;

        public MapProvidersController(IQueriesFactory queriesFactory)
        {
            _queriesFactory = queriesFactory;
        }

        [ResponseCache(VaryByHeader = "authorization", Duration = 3600)]
        [Route("/map-providers")]
        [HttpGet]
        public async Task<ApiResponse> GetAvailableProvider()
        {
            var query = _queriesFactory.Get<GetAvailableMapProvidersQuery>();

            var args = new GetAvailableMapProvidersQueryArgs
            {
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            var result = await query.Ask(args);

            return ApiResponse.Success(result);
        }


        [ResponseCache(VaryByHeader = "authorization", Duration = 3600)]
        [Route("/map-providers/{providerName}")]
        [HttpGet]
        public async Task<ApiResponse> CanUseProvider(string providerName)
        {
            var query = _queriesFactory.Get<CanUseProviderQuery>();

            var args = new CanUseProviderQueryArgs
            {
                ProviderName = providerName,
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            var result = await query.Ask(args);

            return result.UsageApproved
                ? ApiResponse.Success()
                : ApiResponse.Fail(null);
        }
    }
}