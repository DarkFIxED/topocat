using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JetBrains.Annotations;
using Topocat.Common;

namespace Topocat.Domain.Entities.Users
{
    public class AvailableMapProviders : DomainEntity
    {
        [UsedImplicitly]
        protected AvailableMapProviders()
        {
        }

        public AvailableMapProviders(User user)
        {
            User = user;
            UserId = user.Id;

            Google = true;
            Yandex = true;
        }

        public bool Google { get; protected set; }

        public bool Yandex { get; protected set; }

        public User User { get; protected set; }

        [Key]
        [ForeignKey(nameof(User))]
        public string UserId { get; protected set; }
    }
}