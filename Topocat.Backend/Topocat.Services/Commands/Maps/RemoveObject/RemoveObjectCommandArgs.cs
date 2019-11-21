namespace Topocat.Services.Commands.Maps.RemoveObject
{
    public class RemoveObjectCommandArgs
    {
        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string ActionExecutorId { get; set; }
    }
}