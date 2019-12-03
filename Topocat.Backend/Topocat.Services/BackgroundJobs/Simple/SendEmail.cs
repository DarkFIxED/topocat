using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using Topocat.Common;
using Topocat.Services.Models;
using Topocat.Services.Services.Background;

namespace Topocat.Services.BackgroundJobs.Simple
{
    [RegisterScoped]
    public class SendEmail : SimpleBackgroundTask<SendGridMessage>
    {
        private readonly IOptions<SendGridOptions> _options;

        public SendEmail(IOptions<SendGridOptions> options)
        {
            _options = options;
        }

        public override async Task Run(SendGridMessage args)
        {
            var client = new SendGridClient(_options.Value.ApiKey);
            await client.SendEmailAsync(args);
        }
    }
}