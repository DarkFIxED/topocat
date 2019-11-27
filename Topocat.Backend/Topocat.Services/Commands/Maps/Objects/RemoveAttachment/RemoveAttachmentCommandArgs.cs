namespace Topocat.Services.Commands.Maps.Objects.RemoveAttachment
{
    public class RemoveAttachmentCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string AttachmentId { get; set; }
    }
}