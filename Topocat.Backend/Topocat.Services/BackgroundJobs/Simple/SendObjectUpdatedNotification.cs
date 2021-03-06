﻿using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Topocat.Common;
using Topocat.Services.Hubs;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.BackgroundJobs.Simple
{
    [RegisterScoped]
    public class SendObjectUpdatedNotification : SimpleBackgroundTask<string, MapObjectModel>
    {
        private const string MethodName = "ObjectUpdated";

        private readonly IHubContext<MapHub> _mapHubContext;

        public SendObjectUpdatedNotification(IHubContext<MapHub> mapHubContext)
        {
            _mapHubContext = mapHubContext;
        }

        public override async Task Run(string args1, MapObjectModel args2)
        {
            await _mapHubContext.Clients.Group(args1).SendAsync(MethodName, args2);
        }
    }
}