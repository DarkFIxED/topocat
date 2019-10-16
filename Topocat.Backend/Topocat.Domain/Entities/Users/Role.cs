using Microsoft.AspNetCore.Identity;
using Topocat.Common;

namespace Topocat.Domain.Entities.Users
{
    public class Role: IdentityRole<string>, IHasIdentifier<string>
    {
    }
}
