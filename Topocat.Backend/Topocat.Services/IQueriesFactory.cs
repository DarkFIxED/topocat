using Topocat.Common;

namespace Topocat.Services
{
    public interface IQueriesFactory
    {
        T Get<T>() where T : IQuery;
    }
}