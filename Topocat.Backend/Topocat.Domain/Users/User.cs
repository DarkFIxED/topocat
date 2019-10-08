﻿using Microsoft.AspNetCore.Identity;
using Topocat.Common;

namespace Topocat.Domain.Users
{
    public class User : IdentityUser<string>, IHasIdentifier<string>
    {
    }
}