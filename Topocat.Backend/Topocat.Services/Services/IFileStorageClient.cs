namespace Topocat.Services.Services
{
    public interface IFileStorageClient
    {
        string GenerateUploadPreSignedUrl(string objectKey, string mimeType);
        string GenerateGetPreSignedUrl(string objectKey);
    }
}