using System;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Options;
using Topocat.Common;
using Topocat.Services.Models;

namespace Topocat.Services.Services
{
    [RegisterScoped(typeof(IFileStorageClient))]
    public class FileStorageClient : IFileStorageClient
    {
        private readonly TimeSpan _putAvailability = new TimeSpan(1, 0, 0);

        private readonly TimeSpan _getAvailability = new TimeSpan(1, 0, 0, 0);

        private readonly IAmazonS3 _client;

        private readonly string _bucketName;

        public FileStorageClient(IOptions<FileStorageOptions> options)
        {
            _bucketName = options.Value.BucketName;
            // TODO: now static Ohio. Add flexible configuration.
            _client = new AmazonS3Client(new BasicAWSCredentials(options.Value.AccessKey, options.Value.SecretKey), RegionEndpoint.USEast2);
        }

        public string GenerateUploadPreSignedUrl(string objectKey, string mimeType)
        {
            return MakeRequest(objectKey, HttpVerb.PUT, DateTime.Now.Add(_putAvailability), mimeType);
        }

        public string GenerateGetPreSignedUrl(string objectKey)
        {
            return MakeRequest(objectKey, HttpVerb.GET, DateTime.Now.Add(_getAvailability));
        }

        private string MakeRequest(string objectKey, HttpVerb verb, DateTime expiration, string mimeType = null)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Verb = verb,
                Expires = expiration,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.None,
            };

            if (!string.IsNullOrEmpty(mimeType))
                request.ContentType = mimeType;

            return _client.GetPreSignedURL(request);
        }
    }
}