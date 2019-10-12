using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Topocat.API.Models;
using Topocat.Services.Exceptions;

namespace Topocat.API.Middlewares
{
    public static class ExceptionMiddlewareExtensions
    {
        public static void ConfigureExceptionHandler(this IApplicationBuilder app)
        {
            app.UseExceptionHandler(appError =>
            {
                appError.Run(async context =>
                {
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (!(contextFeature?.Error is ServiceException))
                        return;

                    var serviceException = (ServiceException)contextFeature.Error;

                    context.Response.StatusCode = (int) HttpStatusCode.OK;
                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(ApiResponse.Fail(serviceException.Message, serviceException.Error)));
                });
            });
        }
    }
}