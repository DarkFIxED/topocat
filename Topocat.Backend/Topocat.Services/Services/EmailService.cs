using DalSoft.Hosting.BackgroundQueue;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    //TODO: Uncomment when FakeEmailService will be gone.
    //[RegisterScoped(typeof(IEmailService))]
    public class EmailService : IEmailService
    {
        private readonly SendGridOptions _sendGridOptions;
        private readonly BackgroundQueue _backgroundQueue;

        public EmailService(IOptions<SendGridOptions> sendGridOptions, BackgroundQueue backgroundQueue)
        {
            _backgroundQueue = backgroundQueue;
            _sendGridOptions = sendGridOptions.Value;
        }

        public void SendEmail(EmailMessage message)
        {
            var client = new SendGridClient(_sendGridOptions.ApiKey);
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
            
            _backgroundQueue.Enqueue(async cancellationToken =>
            {
                await client.SendEmailAsync(msg, cancellationToken);
            });
        }
    }
}