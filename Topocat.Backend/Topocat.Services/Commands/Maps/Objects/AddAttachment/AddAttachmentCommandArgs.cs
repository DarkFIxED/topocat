namespace Topocat.Services.Commands.Maps.Objects.AddAttachment
{
    public class AddAttachmentCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string SourceFileName { get; set; }
    }
}