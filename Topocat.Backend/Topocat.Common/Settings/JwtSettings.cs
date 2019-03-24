namespace Topocat.Common.Settings
{
    public class JwtSettings
    {
        public string JwtKey { get; set; }

        public string JwtIssuer { get; set; }

        public string JwtAudience { get; set; }

        public int JwtExpireDays { get; set; }
    }
}
