using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Exceptions;
using Topocat.Services.QueryExtensions;
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Maps.Objects.AddObject
{
    [RegisterScoped]
    public class AddObjectCommand : ICommand<AddObjectCommandArgs, AddObjectCommandResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IGeometryConverter _geometryConverter;

        public AddObjectCommand(UserManager<User> userManager,
            IRepository repository, 
            IGeometryConverter geometryConverter)
        {
            _userManager = userManager;
            _repository = repository;
            _geometryConverter = geometryConverter;
        }

        public async Task<AddObjectCommandResult> Execute(AddObjectCommandArgs args)
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

            var geometry = _geometryConverter.FromWktString(args.WktString);

            var mapObject = new MapObject(map, args.Title, geometry);
            map.Add(mapObject);

            _repository.Update(map);
            await _repository.SaveAsync();

            return new AddObjectCommandResult
            {
                ObjectId = mapObject.Id
            };
        }
    }
}