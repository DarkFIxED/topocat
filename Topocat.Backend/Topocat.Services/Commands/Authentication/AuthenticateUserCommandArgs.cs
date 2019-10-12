using System;
using System.Collections.Generic;
using System.Text;

namespace Topocat.Services.Commands.Authentication
{
    public class AuthenticateUserCommandArgs
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }
}
