namespace Topocat.Services
{
    public interface ICommandsFactory
    {
        T Get<T>() where T : ICommand;
    }
}