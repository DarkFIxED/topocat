using System.Linq;
using System.Threading.Tasks;
using Topocat.Domain;

namespace Topocat.DB
{
    public interface IRepository
    {
        void Update<T>(T entity) where T : class, IDomainEntity;

        void Create<T>(T entity) where T : class, IDomainEntity;

        void Delete<T>(T entity) where T : class, IDomainEntity;

        IQueryable<T> AsQueryable<T>() where T : class, IDomainEntity;

        Task<int> SaveAsync();
    }
}