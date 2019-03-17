using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Moq;
using NUnit.Framework;
using Topocat.BusinessLogic.Services.User;
using Topocat.BusinessLogic.Services.User.Models;
using Topocat.Common.Settings;
using Topocat.Domain;
using Topocat.UnitTests.Common;

namespace Topocat.UnitTests
{
    [TestFixture]
    public class UserServiceTests
    {
        [Test]
        public async Task Registration_ValidUser_UserWillBeCreatedAndAccessTokenWillBeReturned()
        {
            var registrationModel = new SignUpModel
            {
                Email = "test@mail.com",
                Login = "test",
                Password = "pwd"
            };

            var signInManager = new Mock<FakeSignInManager>();
            var userManager = new Mock<FakeUserManager>();

            userManager.Setup(x => x.CreateAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);
            signInManager.Setup(x => x.SignInAsync(It.IsAny<User>(), false, null)).Returns(Task.CompletedTask);

            var service = new UserService(userManager.Object, signInManager.Object, GetFakeJwtSettings());

            var token = await service.SignUp(registrationModel);

            Assert.AreNotEqual(string.Empty, token);
        }

        [Test]
        public async Task Login_UserExist_AccessTokenWillBeReturned()
        {
            var users = new List<User>
            {
                new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "test@mail.com"
                }
            };
            var queryableUsers = users.AsQueryable();

            var loginModel = new SignInModel
            {
                Email = "test@mail.com",
                Password = "pwd"
            };

            var signInManager = new Mock<FakeSignInManager>();
            var userManager = new Mock<FakeUserManager>();

            var service = new UserService(userManager.Object, signInManager.Object, GetFakeJwtSettings());

            signInManager.Setup(x => x.SignInAsync(It.IsAny<User>(), false, null)).Returns(Task.CompletedTask);
            signInManager.Setup(x => x.PasswordSignInAsync(It.IsAny<string>(), It.IsAny<string>(), false, false)).ReturnsAsync(SignInResult.Success);
            userManager.Setup(x => x.Users).Returns(queryableUsers);

            var token = await service.SignIn(loginModel);

            Assert.AreNotEqual(string.Empty, token);
        }

        private static JwtSettings GetFakeJwtSettings()
        {
            return new JwtSettings
            {
                JwtAudience = "Audience",
                JwtExpireDays = 100,
                JwtIssuer = "Issuer",
                JwtKey = "33E41684-B97A-4FBA-AFA9-9BEACDC25C0A"
            };
        }
    }
}
