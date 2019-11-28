using System;
using Microsoft.Extensions.Options;
using Topocat.Common;
using Topocat.Common.Extensions;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped]
    public class EndpointsBuilder
    {
        private readonly ImageResizerOptions _imageResizerOptions;

        public EndpointsBuilder(IOptions<ImageResizerOptions> imageResizerOptions)
        {
            _imageResizerOptions = imageResizerOptions.Value;
        }

        public string BuildImagePreviewUrl(string objectKey)
        {
            var segments = objectKey.Split('/');

            var pathTemplate = $"{segments[0]}/{{0}}/{segments[1]}";

            var url = new Uri(_imageResizerOptions.Endpoint)
                .AddParameter("path", pathTemplate);

            return url.ToString();
        }
    }
}