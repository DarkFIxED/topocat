using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Map.Objects;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.AddLine
{
    [RegisterScoped]
    public class AddLineCommand : ICommand<AddLineCommandArgs, AddLineCommandResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;

        public AddLineCommand(UserManager<User> userManager, IRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }

        public async Task<AddLineCommandResult> Execute(AddLineCommandArgs args)
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

            if (!map.CanModify(actionExecutor))
                throw new ServiceException("User has no access to modify map");

            var newLine = new Line(map, args.Title, args.Start, args.End);
            map.Add(newLine);

            _repository.Update(map);
            await _repository.SaveAsync();

            return new AddLineCommandResult
            {
                LineId = newLine.Id
            };
        }
    }
}
