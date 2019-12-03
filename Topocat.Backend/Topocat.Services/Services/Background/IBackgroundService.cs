namespace Topocat.Services.Services.Background
{
    public interface IBackgroundService
    {
        void RunInBackground<T, TArgs1, TArgs2>(TArgs1 args1, TArgs2 args2) where T : SimpleBackgroundTask<TArgs1, TArgs2>;
        void RunInBackground<T, TArgs>(TArgs args) where T : SimpleBackgroundTask<TArgs>;
    }
}