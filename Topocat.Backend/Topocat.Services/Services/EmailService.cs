using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IEmailService))]
    public class EmailService : IEmailService
    {
        public void SendEmail(EmailMessage message)
        {
            
        }
    }
}