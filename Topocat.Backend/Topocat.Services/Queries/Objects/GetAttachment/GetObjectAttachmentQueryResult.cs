namespace Topocat.Services.Queries.Objects.GetAttachment
{
    public class GetObjectAttachmentQueryResult
    {
        public string Id { get; set; }

        public string AccessUrl { get; set; }

        public string MimeType { get; set; }

        public string PreviewTemplate { get; set; }

        public string SourceFileName { get; set; }
    }
}