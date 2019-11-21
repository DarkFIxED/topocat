using System;
using System.Collections.Generic;
using System.Text;

namespace Topocat.Services.Models
{
    public class JWTOptions
    {
        public string Audience { get; set; }

        public string Issuer { get; set; }

        public string Key { get; set; }

        public TimeSpan AccessTokenLifeTime { get; set; }

        public TimeSpan RefreshTokenLifeTime { get; set; }
    }
}
