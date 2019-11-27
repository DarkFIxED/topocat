using System;
using System.Linq;
using System.Text;
using DalSoft.Hosting.BackgroundQueue.DependencyInjection;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Topocat.API.Activators;
using Topocat.API.Middlewares;
using Topocat.API.StartupExtensions;
using Topocat.DB;
using Topocat.Domain.Entities.Users;
using Topocat.Services.Hubs;
using Topocat.Services.Models;
using Topocat.Services.Services;

namespace Topocat.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            AppConfiguration = configuration;
        }

        public IConfiguration AppConfiguration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddNewtonsoftJson();

            services.AddCors();

            services.AddDbContext<TopocatContext>(builder => { builder.UseSqlServer(AppConfiguration.GetConnectionString("Database"), x => x.UseNetTopologySuite()); });

            services.AddIdentity<User, Role>(options =>
                {
                    options.Password.RequiredLength = 6;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireDigit = false;
                })
                .AddEntityFrameworkStores<TopocatContext>()
                .AddDefaultTokenProviders();

            var jwtOptions = AppConfiguration.GetSection("JWTOptions").Get<JWTOptions>();
            var tokenValidationParams = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidAudience = jwtOptions.Audience,
                ValidIssuer = jwtOptions.Issuer,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key)),
            };

            services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.RequireHttpsMetadata = false;
                    options.TokenValidationParameters = tokenValidationParams;

                    var existingValidator = options.SecurityTokenValidators.First();
                    var customValidator = new SecurityTokenTypeValidator(existingValidator);
                    options.SecurityTokenValidators.Clear();
                    options.SecurityTokenValidators.Add(customValidator);
                });

            
            services.RegisterSwagger();
            services.RegisterHangfire(AppConfiguration.GetConnectionString("Database"));
           
            services.AddBackgroundQueue(exc => { });
            services.AddSignalR();

            services.RegisterDI(AppConfiguration, tokenValidationParams);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider serviceProvider)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                UpdateDatabase(app);
            }

            app.ConfigureExceptionHandler();

            GlobalConfiguration.Configuration.UseActivator(new HangfireActivator(serviceProvider));
            app.UseHangfireServer();
            app.UseHangfireDashboard();

            var frontendUrls = AppConfiguration.GetSection("FrontendUrls").Get<FrontendUrls>();

            app.UseCors(builder => builder
                .WithOrigins(frontendUrls.BaseUrl)
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials()
            );

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<MapHub>("/mapHub");
            });

            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Test API V1"); });

            app.UseRobotsTxt(builder => builder.DenyAll());

            app.RunBackgroundJobs();
        }

        private static void UpdateDatabase(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope();
            using var context = serviceScope.ServiceProvider.GetService<TopocatContext>();

            context.Database.Migrate();
        }
    }
}
