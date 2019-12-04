using System.Collections.Generic;

namespace Topocat.API.Models.MapObjects
{
    public class UpdateObjectRequestModel
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public string WktString { get; set; }

        public List<string> Tags { get; set; }
    }
}
