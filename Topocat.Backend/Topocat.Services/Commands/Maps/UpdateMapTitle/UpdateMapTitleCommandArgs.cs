namespace Topocat.Services.Commands.Maps.UpdateMapTitle
{
    public class UpdateMapTitleCommandArgs
    {
        public string MapId { get; set; }

        public string ActionExecutorId { get; set; }

        public string NewTitle { get; set; }
    }
}