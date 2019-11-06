using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.Common.DomainEventsDispatcher;

namespace Topocat.DB
{
    [RegisterScoped(typeof(IRepository))]
    public class Repository : IRepository
    {
        private readonly TopocatContext _context;
        private readonly IDomainEventsDispatcher _domainEventsDispatcher;

        public Repository(TopocatContext context, IDomainEventsDispatcher domainEventsDispatcher)
        {
            _context = context;
            _domainEventsDispatcher = domainEventsDispatcher;
        }

        public void Update<T>(T entity) where T : class, IDomainEntity
        {
            _context.Set<T>().Update(entity);
        }

        public void Create<T>(T entity) where T : class, IDomainEntity
        {
            _context.Set<T>().Add(entity);
        }

        public void Delete<T>(T entity) where T : class, IDomainEntity
        {
            _context.Entry(entity).State = EntityState.Deleted;
        }

        public IQueryable<T> AsQueryable<T>() where T : class, IDomainEntity
        {
            return _context.Set<T>().AsQueryable();
        }

        public async Task<int> SaveAsync()
        {
            var domainEvents = _context.GetDomainEvents();

            var result = await _context.SaveChangesAsync();

            foreach (var domainEvent in domainEvents)
            {
                _domainEventsDispatcher.Dispatch(domainEvent);
            }

            return result;
        }
    }
}