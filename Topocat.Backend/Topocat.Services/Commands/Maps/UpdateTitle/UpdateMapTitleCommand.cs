﻿using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.UpdateTitle
{
    [RegisterScoped]
    public class UpdateMapTitleCommand : ICommand<UpdateMapTitleCommandArgs>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;

        public UpdateMapTitleCommand(UserManager<User> userManager, IRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }

        public async Task Execute(UpdateMapTitleCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            if (actionExecutor == null)
                throw new ArgumentException("User not found", nameof(actionExecutor));

            var map = await _repository.AsQueryable<Map>()
                .WithId(args.MapId)
                .LoadAggregate()
                .FirstOrDefaultAsync();

            if (map == null)
                throw new ServiceException("Map not found");

            map.SetTitle(args.NewTitle);

            _repository.Update(map);

            await _repository.SaveAsync();
        }
    }
}
