using System;
using Microsoft.Extensions.Options;
using Topocat.Common;
using Topocat.Common.Extensions;
using Topocat.Services.Models;

namespace Topocat.Services.Emails
{
    [RegisterScoped]
    public class ResetPasswordEmailTemplate : IEmailTemplate<ResetPasswordEmailTemplateArgs>
    {
        private readonly FrontendUrls _frontendUrls;

        public ResetPasswordEmailTemplate(IOptions<FrontendUrls> frontendUrls)
        {
            _frontendUrls = frontendUrls.Value;
        }

        public EmailMessage Build(ResetPasswordEmailTemplateArgs args)
        {
            var uri = new Uri($"{_frontendUrls.BaseUrl}/restore-password")
                .AddParameter("token", args.Token)
                .AddParameter("email", args.Address);


            return new EmailMessage
            {
                Subject = "Topocat: Password reset",
                Addresses = new[] {args.Address},
                Body = $"To reset password follow next url: {uri}"
            };
        }
    }
}