using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Domain.Entities.Users;

namespace Topocat.Services.Commands.Maps.Create
{
    [RegisterScoped]
    public class CreateMapCommand : ICommand<CreateMapCommandArgs, CreateMapCommandResult>
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository _repository;

        public CreateMapCommand(
            IRepository repository, 
            UserManager<User> userManager
            )
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task<CreateMapCommandResult> Execute(CreateMapCommandArgs args)
        {
            var actionExecutor = await _userManager.FindByIdAsync(args.ActionExecutorId);
            if (actionExecutor == null)
                throw new ArgumentException("User not found", nameof(actionExecutor));

            var map = new Map(actionExecutor, args.Title);

            _repository.Create(map);

            await _repository.SaveAsync();

            return new CreateMapCommandResult
            {
                MapId = map.Id
            };
        }
    }
}