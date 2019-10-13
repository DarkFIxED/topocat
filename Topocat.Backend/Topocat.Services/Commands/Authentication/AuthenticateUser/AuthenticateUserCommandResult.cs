namespace Topocat.Services.Commands.Authentication.AuthenticateUser
{
    public class AuthenticateUserCommandResult
    {
        public string AccessToken { get; set; }

        public string RefreshToken { get; set; }
    }
}
