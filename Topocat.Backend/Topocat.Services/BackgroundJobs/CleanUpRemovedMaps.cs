using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Domain.Entities.Map;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.BackgroundJobs
{
    [RegisterScoped]
    public class CleanUpRemovedMaps : IBackgroundJob
    {
        private readonly IRepository _repository;

        public CleanUpRemovedMaps(IRepository repository)
        {
            _repository = repository;
        }

        public async Task Run()
        {
            var mapsQuery = _repository.AsQueryable<Map>().Removed();

            var fileReferences = await mapsQuery
                .SelectMany(x => x.ObjectsList)
                .SelectMany(x => x.FileReferencesBindings)
                .Select(x => x.FileReference)
                .ToListAsync();

            fileReferences.ForEach(fr =>
            {
                fr.ScheduleToRemove();
                _repository.Update(fr);
            });

            var maps = await mapsQuery.ToListAsync();

            maps.ForEach(map =>
            {
                _repository.Delete(map);
            });

            await _repository.SaveAsync();
        }
    }
}