using Topocat.Common;

namespace Topocat.Domain.Users
{
    public class User : IHasIdentifier<string>
    {
        public string Id { get; set; }
    }
}