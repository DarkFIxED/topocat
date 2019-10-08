using Microsoft.AspNetCore.Identity;
using Topocat.Common;

namespace Topocat.Domain.Users
{
    public class Role: IdentityRole<string>, IHasIdentifier<string>
    {
    }
}
