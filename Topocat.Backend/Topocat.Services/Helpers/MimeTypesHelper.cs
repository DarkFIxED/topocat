using System.Linq;

namespace Topocat.Services.Helpers
{
    public static class MimeTypesHelper
    {
        public static bool IsPreviewSupporting(string mimeType)
        {
            //JPEG, PNG, WebP, GIF, SVG, TIFF are supported
            var supportingPreviewTypes = new[]
            {
                "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/tiff"
            };

            mimeType = mimeType.ToLower();

            return supportingPreviewTypes.Any(type => type == mimeType);
        }
    }
}