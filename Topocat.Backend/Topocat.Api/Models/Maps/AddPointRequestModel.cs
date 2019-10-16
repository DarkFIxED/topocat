using Topocat.Domain.Types;

namespace Topocat.API.Models.Maps
{
    public class AddPointRequestModel
    {
        public string Title { get; set; }

        public Coordinates Coordinates { get; set; }
    }
}