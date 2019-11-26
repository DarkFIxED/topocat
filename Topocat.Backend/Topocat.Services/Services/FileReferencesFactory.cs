using System;
using Topocat.Common;
using Topocat.Domain.Entities.Files;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IFileReferencesFactory))]
    public class FileReferencesFactory : IFileReferencesFactory
    {
        private const string AttachmentsFolder = "upload";
        
        public FileReference GenerateMapObjectAttachment(string sourceFileName)
        {
            var objectKey = $"{AttachmentsFolder}/{Guid.NewGuid():D}";
            var fileReference = new FileReference(objectKey, sourceFileName);

            return fileReference;
        }
    }
}