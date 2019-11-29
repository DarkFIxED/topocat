using System;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;

namespace Topocat.Infrastructure.FileStorage
{
    public class FileStorageService : IFileStorageService
    {
        private readonly TimeSpan _putAvailability = new TimeSpan(1, 0, 0);

        private readonly TimeSpan _getAvailability = new TimeSpan(1, 0, 0, 0);

        private readonly IAmazonS3 _client;

        private readonly string _bucketName;

        public FileStorageService(FileStorageOptions options)
        {
            _bucketName = options.BucketName;
            _client = new AmazonS3Client(new BasicAWSCredentials(options.AccessKey, options.SecretKey));
        }

        public string GenerateUploadPreSignedUrl(string objectKey)
        {
            return MakeRequest(objectKey, HttpVerb.PUT, DateTime.Now.Add(_putAvailability));
        }

        public string GenerateGetPreSignedUrl(string objectKey)
        {
            return MakeRequest(objectKey, HttpVerb.PUT, DateTime.Now.Add(_getAvailability));
        }

        private string MakeRequest(string objectKey, HttpVerb verb, DateTime expiration)
        {
            var request = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                Verb = verb,
                Expires = expiration
            };

            return _client.GetPreSignedURL(request);
        }
    }
}