﻿using System;
using System.Collections.Generic;

namespace Topocat.Services.Models
{
    public class MapModel
    {
        public string Id { get; set; }

        public string Title { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        public DateTimeOffset LastModifiedAt { get; set; }

        public List<MapObjectModel> Objects { get; set; }
    }
}
