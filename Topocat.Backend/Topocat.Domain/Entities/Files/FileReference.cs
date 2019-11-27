using System;
using JetBrains.Annotations;
using Topocat.Common;

namespace Topocat.Domain.Entities.Files
{
    public class FileReference : DomainEntity, IHasIdentifier<string>, ICreatedAt
    {
        [UsedImplicitly]
        protected FileReference()
        {
        }

        public FileReference(string objectKey, string sourceFileName, string mimeType)
        {
            Id = Guid.NewGuid().ToString("D");
            CreatedAt = DateTimeOffset.UtcNow;

            ObjectKey = objectKey;
            SourceFileName = sourceFileName;
            MimeType = mimeType;

            UploadConfirmed = false;
        }

        public string Id { get; protected set; }

        public DateTimeOffset CreatedAt { get; protected set; }

        public string ObjectKey { get; protected set; }

        public bool UploadConfirmed { get; protected set; }

        public string SourceFileName { get; protected set; }

        public string MimeType { get; protected set; }

        public void ConfirmUpload()
        {
            UploadConfirmed = true;
        }
    }
}