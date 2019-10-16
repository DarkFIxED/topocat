using Topocat.Domain.Types;

namespace Topocat.API.Models.Maps
{
    public class UpdateLineRequestModel
    {
        public string Title { get; set; }

        public Coordinates Start { get; set; }

        public Coordinates End { get; set; }
    }
}
