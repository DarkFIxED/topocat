using System.Threading.Tasks;

namespace Topocat.Services
{
    public interface IQuery { }

    public interface IQuery<TResult> : IQuery
    {
        Task<TResult> Ask();
    }

    public interface IQuery<in TArgs, TResult> : IQuery
    {
        Task<TResult> Ask(TArgs args);
    }
}