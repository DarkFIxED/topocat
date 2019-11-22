namespace Topocat.Services.Commands.Maps.Objects.RemoveObject
{
    public class RemoveObjectCommandArgs
    {
        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string ActionExecutorId { get; set; }
    }
}