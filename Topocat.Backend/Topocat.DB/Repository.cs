using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Topocat.Common;
using Topocat.Domain;

namespace Topocat.DB
{
    [RegisterScoped(typeof(IRepository))]
    public class Repository : IRepository
    {
        private readonly TopocatContext _context;

        public Repository(TopocatContext context)
        {
            _context = context;
        }

        public void Update<T>(T entity) where T : DomainEntity
        {
            _context.Set<T>().Update(entity);
        }

        public void Create<T>(T entity) where T : DomainEntity
        {
            _context.Set<T>().Add(entity);
        }

        public void Delete<T>(T entity) where T : DomainEntity
        {
            _context.Entry(entity).State = EntityState.Deleted;
        }

        public IQueryable<T> AsQueryable<T>() where T : DomainEntity
        {
            return _context.Set<T>().AsQueryable();
        }

        public async Task<int> SaveAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}