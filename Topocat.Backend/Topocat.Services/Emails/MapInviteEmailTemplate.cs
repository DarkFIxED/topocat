using System;
using Microsoft.Extensions.Options;
using Topocat.Common;
using Topocat.Common.Extensions;
using Topocat.Services.Models;

namespace Topocat.Services.Emails
{
    [RegisterScoped]
    public class MapInviteEmailTemplate: IEmailTemplate<MapInviteEmailTemplateArgs>
    {
        private readonly FrontendUrls _frontendUrls;

        public MapInviteEmailTemplate(IOptions<FrontendUrls> frontendUrls)
        {
            _frontendUrls = frontendUrls.Value;
        }

        public EmailMessage Build(MapInviteEmailTemplateArgs args)
        {
            var uri = new Uri($"{_frontendUrls.BaseUrl}/accept-invite")
                .AddParameter("mapId", args.MapId)
                .AddParameter("inviteId", args.InviteId);

            return new EmailMessage
            {
                Subject = "Topocat: New invitation to map",
                Body = $"You invited to map. To accept or decline invitation follow next link: {uri}",
                Addresses = new[]
                {
                    args.Address
                }
            };
        }
    }
}