namespace Topocat.API.Models.PasswordRestoration
{
    public class ResetPasswordRequestModel
    {
        public string Token { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }
    }
}