namespace Topocat.Services.Emails
{
    public class ResetPasswordEmailTemplateArgs
    {
        public string Address { get; set; }

        public string Token { get; set; }
    }
}