﻿namespace Topocat.Services.Commands.Maps.AddObject
{
    public class AddObjectCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string Title { get; set; }

        public string WktString { get; set; }
    }
}