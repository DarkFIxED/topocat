using System.Threading.Tasks;

namespace Topocat.Services.Services.Background
{
    public abstract class SimpleBackgroundTask
    {
    }

    public abstract class SimpleBackgroundTask<TArgs> : SimpleBackgroundTask
    {
        public abstract Task Run(TArgs args);
    }

    public abstract class SimpleBackgroundTask<TArgs1, TArgs2> : SimpleBackgroundTask
    {
        public abstract Task Run(TArgs1 args1, TArgs2 args2);
    }
}