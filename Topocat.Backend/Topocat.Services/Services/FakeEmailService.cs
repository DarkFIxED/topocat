using Microsoft.Extensions.Logging;
using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IEmailService))]
    public class FakeEmailService : IEmailService
    {
        private readonly ILogger<FakeEmailService> _logger;

        public FakeEmailService(ILogger<FakeEmailService> logger)
        {
            _logger = logger;
        }

        public void SendEmail(EmailMessage message)
        {
            var receivers = string.Join(", ", message.Addresses);
            _logger.LogTrace($"Email sent. Subject:{message.Subject}. Receivers: {receivers}. Body: {message.Body}");
        }
    }
}