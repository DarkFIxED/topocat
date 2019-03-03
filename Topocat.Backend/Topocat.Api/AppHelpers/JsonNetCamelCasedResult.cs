using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Topocat.Api.AppHelpers
{
    /// <inheritdoc />
    /// <summary>
    /// Json result using JSON.NET in camelCase
    /// </summary>
    public class JsonNetCamelCasedResult : JsonResult
    {
        public JsonNetCamelCasedResult(object value) : base(value) { }

        /// <inheritdoc />
        /// <summary>
        /// Enables processing of the result of an action method by a custom type that inherits from the <see cref="T:System.Web.Mvc.ActionResult" /> class.
        /// </summary>
        /// <param name="context">The context within which the result is executed.</param><exception cref="T:System.ArgumentNullException">The <paramref name="context" /> parameter is null.</exception>
        public override async Task ExecuteResultAsync(ActionContext context)
        {
            if (context == null)
                throw new ArgumentNullException(nameof(context));

            var response = context.HttpContext.Response;

            response.ContentType = !string.IsNullOrEmpty(ContentType)
                ? ContentType
                : "application/json";

            var serializedObject = JsonConvert.SerializeObject(Value, new JsonSerializerSettings
            {
                Formatting = Formatting.None,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                NullValueHandling = NullValueHandling.Ignore
            });

            await response.WriteAsync(serializedObject);
        }
    }
}
