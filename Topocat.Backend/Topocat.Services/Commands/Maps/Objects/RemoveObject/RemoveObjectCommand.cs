using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.Objects.RemoveObject
{
    [RegisterScoped]
    public class RemoveObjectCommand : ICommand<RemoveObjectCommandArgs>
    {
        private readonly UserManager<User> _userManager;

        private readonly IRepository _repository;

        public RemoveObjectCommand(UserManager<User> userManager, IRepository repository)
        {
            _userManager = userManager;
            _repository = repository;
        }

        public async Task Execute(RemoveObjectCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            if (actionExecutor == null)
                throw new ArgumentException("User not found", nameof(actionExecutor));

            var map = await _repository.AsQueryable<Map>()
                .WithId(args.MapId)
                .WithAccessOf(actionExecutor.Id)
                .LoadAggregate()
                .FirstOrDefaultAsync();

            if (map == null)
                throw new ServiceException("Map not found");

            var mapObject = map.ObjectsList
                .FirstOrDefault(x => x.Id == args.ObjectId);

            if (mapObject == null)
                throw new ServiceException("Object not found");

            map.Delete(actionExecutor, mapObject);
            _repository.Update(mapObject);

            await _repository.SaveAsync();
        }
    }
}