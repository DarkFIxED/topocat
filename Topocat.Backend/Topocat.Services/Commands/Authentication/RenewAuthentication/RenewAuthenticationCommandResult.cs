namespace Topocat.Services.Commands.Authentication.RenewAuthentication
{
    public class RenewAuthenticationCommandResult
    {
        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }
}