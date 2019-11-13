using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Topocat.DB;

namespace Topocat.Services.Hubs
{
    public class MapHub : Hub
    {
        private readonly IRepository _repository;

        public MapHub(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Initialize(string mapId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, mapId);
        }
    }
}