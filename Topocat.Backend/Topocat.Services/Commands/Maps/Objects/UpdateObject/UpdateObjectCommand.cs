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
using Topocat.Services.Services;

namespace Topocat.Services.Commands.Maps.Objects.UpdateObject
{
    [RegisterScoped]
    public class UpdateObjectCommand : ICommand<UpdateObjectCommandArgs>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;
        private readonly IGeometryConverter _geometryConverter;

        public UpdateObjectCommand(UserManager<User> userManager, 
            IRepository repository,
            IGeometryConverter geometryConverter)
        {
            _userManager = userManager;
            _repository = repository;
            _geometryConverter = geometryConverter;
        }

        public async Task Execute(UpdateObjectCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);

            if (actionExecutor == null)
                throw new ArgumentException("User not found", nameof(actionExecutor));

            var map = await _repository.AsQueryable<Map>()
                .NotRemoved()
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

            var geometry = _geometryConverter.FromWktString(args.WktString);

            mapObject.Update(args.Title, args.Description, geometry);
            mapObject.ReplaceTags(args.Tags);

            _repository.Update(mapObject);

            await _repository.SaveAsync();
        }
    }
}