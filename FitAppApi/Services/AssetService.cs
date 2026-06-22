using FitAppApi.Data;
using FitAppApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FitAppApi.Services
{
    public interface IAssetService
    {
        Task<IEnumerable<Asset>> GetAllAsync();
        Task<Asset?> GetByIdAsync(Guid id);
        Task<Asset> CreateAsync(Asset entity);
        Task<Asset> UpdateAsync(Guid id, Asset entity);
        Task<bool> DeleteAsync(Guid id);
    }

    public class AssetService : IAssetService
    {
        private readonly FitAppDbContext _context;
        public AssetService(FitAppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Asset>> GetAllAsync()
        {
            return await _context.Assets.ToListAsync();
        }
        public async Task<Asset?> GetByIdAsync(Guid id)
        {
            return await _context.Assets.FindAsync(id);
        }

        public async Task<Asset> CreateAsync(Asset entity)
        {
            entity.CreatedAt = DateTime.UtcNow;
            entity.CreatedBy = "System"; //TODO: Get this from something like context.User.Identity.Name;
            _context.Assets.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Asset> UpdateAsync(Guid id, Asset entity)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                throw new InvalidOperationException("Asset not found");

            // Update the asset properties
            asset.Title = entity.Title;
            asset.FileKey = entity.FileKey;
            asset.ContentType = entity.ContentType;
            asset.Size = entity.Size;
            asset.Description = entity.Description;
            asset.Tags = entity.Tags;
            asset.UpdatedAt = DateTime.UtcNow;
            asset.UpdatedBy = "System"; //TODO: Get this from something like context.User.Identity.Name;
            // Update other properties as needed

            await _context.SaveChangesAsync();
            return asset;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var asset = await _context.Assets.FindAsync(id);
            if (asset == null)
                return false;

            _context.Assets.Remove(asset);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}