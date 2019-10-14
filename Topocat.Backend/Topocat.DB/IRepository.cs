using System.Linq;
using System.Threading.Tasks;
using Topocat.Domain;

namespace Topocat.DB
{
    public interface IRepository
    {
        void Update<T>(T entity) where T : DomainEntity;

        void Create<T>(T entity) where T : DomainEntity;

        void Delete<T>(T entity) where T : DomainEntity;

        IQueryable<T> AsQueryable<T>() where T : DomainEntity;

        Task<int> SaveAsync();
    }
}