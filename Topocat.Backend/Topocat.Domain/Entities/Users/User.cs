using System;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Identity;
using Topocat.Common;
// ReSharper disable VirtualMemberCallInConstructor

namespace Topocat.Domain.Entities.Users
{
    public class User : IdentityUser<string>, IHasIdentifier<string>
    {
        [UsedImplicitly]
        protected User()
        {
        }

        public User(string email) : base(email)
        {
            Id = Guid.NewGuid().ToString("D");

            Email = email;
            EmailConfirmed = false;
            NotificationSettings = new UserNotificationSettings(this);
        }

        public UserNotificationSettings NotificationSettings { get; protected set; }
    }
}