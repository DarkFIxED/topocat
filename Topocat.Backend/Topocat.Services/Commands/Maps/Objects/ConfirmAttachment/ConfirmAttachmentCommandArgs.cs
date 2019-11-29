namespace Topocat.Services.Commands.Maps.Objects.ConfirmAttachment
{
    public class ConfirmAttachmentCommandArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string AttachmentId { get; set; }
    }
}