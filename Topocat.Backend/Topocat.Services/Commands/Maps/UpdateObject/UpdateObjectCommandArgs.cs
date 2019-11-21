namespace Topocat.Services.Commands.Maps.UpdateObject
{
    public class UpdateObjectCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string Title { get; set; }

        public string WktString { get; set; }
    }
}