using Topocat.Domain.Entities.Files;

namespace Topocat.Services.Services
{
    public interface IFileReferencesFactory
    {
        FileReference GenerateMapObjectAttachment(string sourceFileName);
    }
}