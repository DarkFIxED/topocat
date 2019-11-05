using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    public interface IEmailService
    {
        void SendEmail(EmailMessage message);
    }
}