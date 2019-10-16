﻿using JetBrains.Annotations;
using Topocat.Domain.Types;

namespace Topocat.Domain.Entities.Map.Objects
{
    public class Point : MapObject
    {
        [UsedImplicitly]
        protected Point() { }

        public Point(Map map, string title, double latitude, double longitude): base(map, title)
        {
            Coordinates = new Coordinates(latitude, longitude);
        }

        public Point(Map map, string title, Coordinates coordinates) : base(map, title)
        {
            Coordinates = coordinates;
        }

        public Coordinates Coordinates { get; protected set; }

    }
}
