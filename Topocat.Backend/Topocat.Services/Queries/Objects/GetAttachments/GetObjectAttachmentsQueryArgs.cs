﻿namespace Topocat.Services.Queries.Objects.GetAttachments
{
    public class GetObjectAttachmentsQueryArgs
    {
        public string MapId { get; set; }

        public string ObjectId { get; set; }

        public string ActionExecutorId { get; set; }
    }
}