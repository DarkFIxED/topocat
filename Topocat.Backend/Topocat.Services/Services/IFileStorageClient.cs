namespace Topocat.Services.Services
{
    public interface IFileStorageClient
    {
        string GenerateUploadPreSignedUrl(string objectKey);
        string GenerateGetPreSignedUrl(string objectKey);
    }
}