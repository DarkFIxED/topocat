using Microsoft.Extensions.Options;
using SendGrid.Helpers.Mail;
using Topocat.Common;
using Topocat.Services.BackgroundJobs.Simple;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IEmailService))]
    public class EmailService : IEmailService
    {
        private readonly SendGridOptions _sendGridOptions;
        private readonly IBackgroundService _backgroundService;

        public EmailService(IOptions<SendGridOptions> sendGridOptions, IBackgroundService backgroundService)
        {
            _backgroundService = backgroundService;
            _sendGridOptions = sendGridOptions.Value;
        }

        public void SendEmail(EmailMessage message)
        {
            var msg = new SendGridMessage
            {
                From = new EmailAddress(_sendGridOptions.SenderEmail, _sendGridOptions.Sender),
                Subject = message.Subject,
                PlainTextContent = message.Body
            };

            foreach (var messageAddress in message.Addresses)
            {
                msg.AddTo(new EmailAddress(messageAddress));
            }
            
            _backgroundService.RunInBackground<SendEmail, SendGridMessage>(msg);
        }
    }
}