using System.ComponentModel.DataAnnotations;

namespace FitAppApi.Models;

public class Asset
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string FileKey { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty; // e.g., "image/jpeg", "video/mp4"
    public long Size { get; set; } // Size in bytes
    public string? Description { get; set; }
    public string? Tags { get; set; } // Comma-separated tags for categorization
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = string.Empty;
    public string? UploadedByIp { get; set; }
    public string? UploadedByUserAgent { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
}
