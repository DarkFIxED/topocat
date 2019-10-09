using System.Threading.Tasks;

namespace Topocat.Services
{
    public interface IQuery<in TArgs, TResult>
    {
        Task<TResult> Ask(TArgs args);
    }
}