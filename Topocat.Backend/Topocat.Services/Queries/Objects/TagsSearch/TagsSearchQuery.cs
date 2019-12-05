using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.DB;
using Topocat.Services.QueryExtensions;

namespace Topocat.Services.Queries.Objects.TagsSearch
{
    [RegisterScoped]
    public class TagsSearchQuery : IQuery<TagsSearchQueryArgs, TagsSearchQueryResult>
    {
        private readonly IRepository _repository;

        public TagsSearchQuery(IRepository repository)
        {
            _repository = repository;
        }

        public async Task<TagsSearchQueryResult> Ask(TagsSearchQueryArgs args)
        {
            var result = await _repository.AsQueryable<Domain.Entities.Map.Map>()
                .WithId(args.MapId)
                .NotRemoved()
                .WithAccessOf(args.ActionExecutorId)
                .SelectMany(x => x.ObjectsList)
                .SelectMany(x => x.Tags)
                .Select(x => x.Tag)
                .Where(tag => tag.Contains(args.SearchString))
                .Distinct()
                .ToListAsync();

            return new TagsSearchQueryResult
            {
                Result = result
            };
        }
    }
}