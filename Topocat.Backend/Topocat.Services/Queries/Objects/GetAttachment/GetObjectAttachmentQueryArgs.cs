namespace Topocat.Services.Queries.Objects.GetAttachment
{
    public class GetObjectAttachmentQueryArgs
    {
        public string ActionExecutorId { get; set; }

        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string AttachmentId { get; set; }
    }
}