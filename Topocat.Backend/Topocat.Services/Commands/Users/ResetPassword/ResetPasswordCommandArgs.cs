namespace Topocat.Services.Commands.Users.ResetPassword
{
    public class ResetPasswordCommandArgs
    {
        public string Token { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
    }
}