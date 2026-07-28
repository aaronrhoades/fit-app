using Amazon.S3;
using Amazon.S3.Model;
using FitAppApi.Models;
using FitAppApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace FitAppApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Asset>>> GetAllAssets()
        {
            var assets = await _assetService.GetAllAsync();
            return Ok(assets);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Asset>> GetAssetById(string id)
        {
            Guid guidId;
            if (!Guid.TryParse(id, out guidId))
            {
                return BadRequest("Invalid ID format");
            }

            var asset = await _assetService.GetByIdAsync(guidId);
            if (asset == null)
                return NotFound();

            return Ok(asset);
        }
        
        [HttpPost]
        public async Task<ActionResult<Asset>> CreateAsset([FromBody] Asset asset)
        {
            var createdAsset = await _assetService.CreateAsync(asset);
            return CreatedAtAction(nameof(GetAssetById), new { id = createdAsset.Id }, createdAsset);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Asset>> UpdateAsset(string id, [FromBody] Asset asset)
        {
            Guid guidId;
            if (!Guid.TryParse(id, out guidId))
            {
                return BadRequest("Invalid ID format");
            }

            var updatedAsset = await _assetService.UpdateAsync(guidId, asset);
            if (updatedAsset == null)
                return NotFound();

            return Ok(updatedAsset);
        }
    }
}