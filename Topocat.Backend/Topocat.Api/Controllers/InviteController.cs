using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Invite;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Invite;
using Topocat.Services.Commands.Maps.SetInviteDecision;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class InviteController : ControllerBase
    {

        private readonly ICommandsFactory _commandsFactory;

        public InviteController(ICommandsFactory commandsFactory)
        {
            _commandsFactory = commandsFactory;
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