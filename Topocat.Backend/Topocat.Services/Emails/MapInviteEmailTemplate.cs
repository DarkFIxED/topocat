using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Emails
{
    [RegisterScoped]
    public class MapInviteEmailTemplate: IEmailTemplate<MapInviteEmailTemplateArgs>
    {
        public EmailMessage Build(MapInviteEmailTemplateArgs args)
        {
            return new EmailMessage
            {
                Subject = "Topocat: New invitation to map",
                Body = "You invited to map",
                Addresses = new[]
                {
                    args.Address
                }
            };
        }
    }
}