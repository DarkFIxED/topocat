﻿using System.Linq;
using Topocat.Common;
using Topocat.Domain.Entities.Map.Events;
using Topocat.Services.BackgroundJobs.Simple;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.DomainEventHandlers
{
    [RegisterScoped(typeof(IDomainEventHandler<MapObjectUpdated>))]
    public class MapObjectUpdatedEventHandler : IDomainEventHandler<MapObjectUpdated>
    {
        private readonly IBackgroundService _backgroundService;

        public MapObjectUpdatedEventHandler(IBackgroundService backgroundService)
        {
            _backgroundService = backgroundService;
        }

        public void Handle(MapObjectUpdated @event)
        {
            var mapObjectModel = new MapObjectModel
            {
                Id = @event.MapObject.Id,
                CreatedAt = @event.MapObject.CreatedAt,
                LastModifiedAt = @event.MapObject.LastModifiedAt,
                Title = @event.MapObject.Title,
                Description = @event.MapObject.Description,
                WktString = @event.MapObject.Geometry.ToString(),
                Tags = @event.MapObject.Tags.Select(x => x.Tag).ToList()
            };

            _backgroundService.RunInBackground<SendObjectUpdatedNotification, string, MapObjectModel>(@event.MapObject.MapId, mapObjectModel);
        }
    }
}