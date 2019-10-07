namespace Topocat.Common
{
    public interface IHasIdentifier<out T>
    {
        T Id { get; }
    }
}
