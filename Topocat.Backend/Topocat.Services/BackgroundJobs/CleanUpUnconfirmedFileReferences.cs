using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Files;
using Topocat.Services.Services;

namespace Topocat.Services.BackgroundJobs
{
    [RegisterScoped]
    public class CleanUpUnconfirmedFileReferences : IBackgroundJob
    {
        private readonly TimeSpan _clearancePeriod = new TimeSpan(-1, 0, 0, 0);

        private readonly IRepository _repository;
        private readonly IFileStorageClient _fileStorageClient;

        public CleanUpUnconfirmedFileReferences(IRepository repository, IFileStorageClient fileStorageClient)
        {
            _repository = repository;
            _fileStorageClient = fileStorageClient;
        }

        public async Task Run()
        {
            var clearanceThreshold = DateTimeOffset.UtcNow.Add(_clearancePeriod);
            var outdatedFileReferences = await _repository.AsQueryable<FileReference>()
                .Where(x => x.CreatedAt <= clearanceThreshold && !x.UploadConfirmed)
                .ToListAsync();

            foreach (var outdatedFileReference in outdatedFileReferences)
            {
                await _fileStorageClient.Remove(outdatedFileReference.ObjectKey);
                _repository.Delete(outdatedFileReference);
            }

            await _repository.SaveAsync();
        }
    }
}