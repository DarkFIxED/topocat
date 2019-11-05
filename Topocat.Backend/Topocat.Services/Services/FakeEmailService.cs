using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped]
    public class FakeEmailService : IEmailService
    {
        public void SendEmail(EmailMessage message)
        {
        }
    }
}