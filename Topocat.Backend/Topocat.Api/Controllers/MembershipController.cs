using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Invite;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Invite;
using Topocat.Services.Commands.Maps.SetInviteDecision;
using Topocat.Services.Queries.Map.GetMapMemberships;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MembershipController : ControllerBase
    {

        private readonly ICommandsFactory _commandsFactory;
        private readonly IQueriesFactory _queriesFactory;

        public MembershipController(ICommandsFactory commandsFactory, IQueriesFactory queriesFactory)
        {
            _commandsFactory = commandsFactory;
            _queriesFactory = queriesFactory;
        }

        [HttpGet]
        [Route("/map/{mapId}/memberships")]
        public async Task<ApiResponse> GetMapMemberships([FromRoute] string mapId)
        {
            var query = _queriesFactory.Get<GetMapMembershipsQuery>();

            var args = new GetMapMembershipsQueryArgs
            {
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            var result = await query.Ask(args);

            return ApiResponse.Success(result);
        }

        [HttpPost]
        [Route("/map/{mapId}/invite")]
        public async Task<ApiResponse> CreateInvite([FromRoute] string mapId, [FromBody] CreateInviteRequestModel requestModel)
        {
            var command = _commandsFactory.Get<InviteUserCommand>();

            var args = new InviteUserCommandArgs
            {
                ActionExecutorId = HttpContext.User.GetUserId(),
                MapId = mapId,
                InvitedEmail = requestModel.Email
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }

        [HttpPut]
        [Route("/map/{mapId}/invite")]
        public async Task<ApiResponse> SetInviteDecision([FromRoute] string mapId, [FromBody] SetInviteDecisionRequestModel requestModel)
        {
            var command = _commandsFactory.Get<SetInviteDecisionCommand>();

            var args = new SetInviteDecisionCommandArgs
            {
                ActionExecutorId = HttpContext.User.GetUserId(),
                MapId = mapId,
                Accept = requestModel.Accept
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }
    }
}