using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.Services;
using Topocat.Services.Queries.Map.CanUseProvider;

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