using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Topocat.API.Models.Users
{
    public class AuthenticateRequestModel
    {
        public string Email { get; set; }

        public string Password { get; set; }
    }
}
