using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;

namespace Topocat.Domain.Entities.Users
{
    public class UserNotificationSettings
    {
        [UsedImplicitly]
        protected UserNotificationSettings() { }

        public UserNotificationSettings(User user)
        {
            UserId = user.Id;
            User = user;

            NotifyAboutNewInvites = true;
        }

        [Key]
        [ForeignKey(nameof(User))]
        public string UserId { get; protected set; }

        public User User { get; protected set; }

        public bool NotifyAboutNewInvites { get; protected set; }
    }
}