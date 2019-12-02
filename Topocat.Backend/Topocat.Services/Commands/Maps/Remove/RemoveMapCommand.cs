using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Commands.Maps.Remove
{
    [RegisterScoped]
    public class RemoveMapCommand : ICommand<RemoveMapCommandArgs>
    {
        private readonly IRepository _repository;

        public RemoveMapCommand(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Execute(RemoveMapCommandArgs args)
        {
            var map = await _repository.AsQueryable<Map>()
                .NotRemoved()
                .WithAdminPermissions(args.ActionExecutorId)
                .WithId(args.MapId)
                .FirstOrDefaultAsync();

            map.MarkAsRemoved();

            _repository.Update(map);

            await _repository.SaveAsync();
        }
    }
}