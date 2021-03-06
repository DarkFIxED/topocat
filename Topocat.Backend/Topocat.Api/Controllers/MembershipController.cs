﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Invite;
using Topocat.Services;
using Topocat.Services.Commands.Maps.Memberships.CancelInvite;
using Topocat.Services.Commands.Maps.Memberships.InviteUser;
using Topocat.Services.Commands.Maps.Memberships.ResendInvite;
using Topocat.Services.Commands.Maps.Memberships.SetInviteDecision;
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
        [Route("/map/{mapId}/invite/{inviteId}")]
        [AllowAnonymous]
        public async Task<ApiResponse> SetInviteDecision([FromRoute] string mapId, [FromRoute]string inviteId, [FromBody] SetInviteDecisionRequestModel requestModel)
        {
            var command = _commandsFactory.Get<SetInviteDecisionCommand>();

            var args = new SetInviteDecisionCommandArgs
            {
                InviteId = inviteId,
                MapId = mapId,
                Accept = requestModel.Accept
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }

        [HttpPost]
        [Route("/map/{mapId}/invite/{inviteId}/resend")]
        public async Task<ApiResponse> ResendInvitation([FromRoute] string mapId, [FromRoute]string inviteId)
        {
            var command = _commandsFactory.Get<ResendInviteCommand>();

            var args = new ResendInviteCommandArgs
            {
                InviteId = inviteId,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }

        [HttpDelete]
        [Route("/map/{mapId}/invite/{inviteId}")]
        public async Task<ApiResponse> CancelInvite([FromRoute] string mapId, [FromRoute]string inviteId)
        {
            var command = _commandsFactory.Get<CancelInviteCommand>();

            var args = new CancelInviteCommandArgs
            {
                InviteId = inviteId,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            };

            await command.Execute(args);

            return ApiResponse.Success();
        }
    }
}