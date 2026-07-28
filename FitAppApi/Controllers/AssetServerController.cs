using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

namespace FitAppApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AssetServerController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly IConfiguration _config;

        public AssetServerController(IAmazonS3 s3Client, IConfiguration config)
        {
            _s3Client = s3Client;
            _config = config;
        }

        [HttpGet("upload-url")]
        public async Task<IActionResult> GetUploadUrl([FromQuery] string fileName, [FromQuery] string contentType)
        {
            var bucketName = _config["AWS-Assets:BucketName"];
            
            // Isolate file keys by tracking folders (e.g., uploads/workouts/file.jpg)
            var fileKey = $"uploads/{Guid.NewGuid()}_{fileName}";

            var request = new GetPreSignedUrlRequest
            {
                BucketName = bucketName,
                Key = fileKey,
                Verb = HttpVerb.PUT,
                Expires = DateTime.UtcNow.AddMinutes(15),
                ContentType = contentType // Pass explicit type from Capacitor (e.g. image/jpeg)
            };

            string presignedUrl = await _s3Client.GetPreSignedURLAsync(request);

            return Ok(new { UploadUrl = presignedUrl, FileKey = fileKey });
        }

        [HttpGet("view-url")]
        public IActionResult GetViewUrl([FromQuery] string fileKey)
        {
            var cloudFrontDomain = _config["AWS-Assets:CloudFrontDomain"];
            var encodedSegments = fileKey
                .Split('/')
                .Select(segment => Uri.EscapeDataString(segment));

            var encodedFileKey = string.Join("/", encodedSegments);

            var fullAssetUrl = $"{cloudFrontDomain}/{encodedFileKey}";
            
            return Ok(new { AssetUrl = fullAssetUrl });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteAsset([FromQuery] string fileKey)
        {
            var bucketName = _config["AWS-Assets:BucketName"];

            var request = new DeleteObjectRequest
            {
                BucketName = bucketName,
                Key = fileKey
            };

            await _s3Client.DeleteObjectAsync(request);

            return Ok();
        }

        [HttpGet("list")]
        public async Task<IActionResult> ListAssets()
        {
            var bucketName = _config["AWS-Assets:BucketName"];

            var request = new ListObjectsV2Request
            {
                BucketName = bucketName,
                Prefix = "uploads/" // Only list files in the uploads folder
            };

            var response = await _s3Client.ListObjectsV2Async(request);

            var assets = response.S3Objects.Select(obj => new
            {
                Key = obj.Key,
                Url = $"{_config["AWS-Assets:CloudFrontDomain"]}/{obj.Key}",
                LastModified = obj.LastModified,
                Size = obj.Size
            });

            return Ok(assets);
        }
    }
}