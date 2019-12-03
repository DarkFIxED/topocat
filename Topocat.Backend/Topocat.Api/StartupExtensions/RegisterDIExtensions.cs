using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Topocat.API.Extensions;
using Topocat.Services.Models;

namespace Topocat.API.StartupExtensions
{
    public static class RegisterDIExtensions
    {
        public static void RegisterDI(this IServiceCollection services, IConfiguration appConfiguration, TokenValidationParameters tokenValidationParams)
        {
            services.RegisterServicesByAttributes();

            services.Configure<JWTOptions>(appConfiguration.GetSection("JWTOptions"));
            services.Configure<SendGridOptions>(appConfiguration.GetSection("SendGridOptions"));
            services.Configure<FrontendUrls>(appConfiguration.GetSection("FrontendUrls"));
            services.Configure<FileStorageOptions>(appConfiguration.GetSection("StorageOptions"));
            services.Configure<ImageResizerOptions>(appConfiguration.GetSection("ImageResizerOptions"));

            services.AddSingleton(tokenValidationParams);
        }
    }
}