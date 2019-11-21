using System;
using System.Threading.Tasks;

namespace Topocat.Services
{
    public interface ICommand
    {
    }

    public interface ICommand<in TArgs, TResult> : ICommand
    {
        Task<TResult> Execute(TArgs args);
    }

    public interface ICommand<in TArgs> : ICommand
    {
        Task Execute(TArgs args);
    }
}
