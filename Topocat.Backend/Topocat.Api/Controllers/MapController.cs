﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Topocat.API.Extensions;
using Topocat.API.Models;
using Topocat.API.Models.Maps;
using Topocat.Services;
using Topocat.Services.Commands.Maps.AddLine;
using Topocat.Services.Commands.Maps.AddPoint;
using Topocat.Services.Commands.Maps.Create;
using Topocat.Services.Commands.Maps.UpdateLine;
using Topocat.Services.Commands.Maps.UpdatePoint;
using Topocat.Services.Commands.Maps.UpdateTitle;
using Topocat.Services.Queries.Map.GetMapQuery;

namespace Topocat.API.Controllers
{
    [ApiController]
    [Authorize]
    public class MapController : ControllerBase
    {
        private readonly ICommandsFactory _commandsFactory;
        private readonly IQueriesFactory _queriesFactory;

        public MapController(ICommandsFactory commandsFactory, IQueriesFactory queriesFactory)
        {
            _commandsFactory = commandsFactory;
            _queriesFactory = queriesFactory;
        }

        [Route("/map")]
        [HttpPost]
        public async Task<ApiResponse> CreateMap(CreateMapRequestModel model)
        {
            var createMapCommand = _commandsFactory.Get<CreateMapCommand>();

            var result = await createMapCommand.Execute(new CreateMapCommandArgs
            {
                Title = model.Title,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }

        [Route("/map/{mapId}/title")]
        [HttpPut]
        public async Task<ApiResponse> UpdateMapTitle([FromRoute] string mapId, [FromBody] UpdateMapTitleRequestModel model)
        {
            var updateMapTitleCommand = _commandsFactory.Get<UpdateMapTitleCommand>();

            await updateMapTitleCommand.Execute(new UpdateMapTitleCommandArgs
            {
                NewTitle = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success();
        }

        [Route("/map/{mapId}/objects/lines")]
        [HttpPost]
        public async Task<ApiResponse> AddLine([FromRoute] string mapId, [FromBody] AddLineRequestModel model)
        {
            var addLineCommand = _commandsFactory.Get<AddLineCommand>();

            var result = await addLineCommand.Execute(new AddLineCommandArgs
            {
                Title = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Start = model.Start,
                End = model.End
            });

            return ApiResponse.Success(result);
        }

        [Route("/map/{mapId}/objects/lines/{lineId}")]
        [HttpPut]
        public async Task<ApiResponse> UpdateLine([FromRoute] string mapId, [FromRoute] string lineId, [FromBody] UpdateLineRequestModel model)
        {
            var updateLineCommand = _commandsFactory.Get<UpdateLineCommand>();

            await updateLineCommand.Execute(new UpdateLineCommandArgs
            {
                Title = model.Title,
                MapId = mapId,
                LineId = lineId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Start = model.Start,
                End = model.End
            });

            return ApiResponse.Success();
        }

        [Route("/map/{mapId}/objects/point")]
        [HttpPost]
        public async Task<ApiResponse> AddPoint([FromRoute] string mapId, [FromBody] AddPointRequestModel model)
        {
            var addPointCommand = _commandsFactory.Get<AddPointCommand>();

            var result = await addPointCommand.Execute(new AddPointCommandArgs
            {
                Title = model.Title,
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Coordinates = model.Coordinates
            });

            return ApiResponse.Success(result);
        }

        [Route("/map/{mapId}/objects/points/{pointId}")]
        [HttpPut]
        public async Task<ApiResponse> UpdatePoint([FromRoute] string mapId, [FromRoute] string pointId, [FromBody] UpdatePointRequestModel model)
        {
            var updateLineCommand = _commandsFactory.Get<UpdatePointCommand>();

            await updateLineCommand.Execute(new UpdatePointCommandArgs
            {
                Title = model.Title,
                MapId = mapId,
                PointId = pointId,
                ActionExecutorId = HttpContext.User.GetUserId(),
                Coordinates = model.Coordinates
            });

            return ApiResponse.Success();
        }

        [Route("/map/{mapId}")]
        [HttpGet]
        public async Task<ApiResponse> GetMap([FromRoute] string mapId)
        {
            var getMapQuery = _queriesFactory.Get<GetMapQuery>();

            var result = await getMapQuery.Ask(new GetMapQueryArgs
            {
                MapId = mapId,
                ActionExecutorId = HttpContext.User.GetUserId()
            });

            return ApiResponse.Success(result);
        }
    }
}