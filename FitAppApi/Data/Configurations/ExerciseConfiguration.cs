using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FitAppApi.Models;

namespace FitAppApi.Data.Configurations;

public class ExerciseConfiguration : IEntityTypeConfiguration<Exercise>
{
    public void Configure(EntityTypeBuilder<Exercise> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(e => e.Description)
            .IsRequired()
            .HasMaxLength(1000);

        builder.Property(e => e.Type)
            .IsRequired();

        builder.HasOne(e => e.ImageAsset)
            .WithMany()
            .HasForeignKey(e => e.ImageAssetId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of an asset if it's associated with any exercise

        builder.HasOne(e => e.VideoAsset)
            .WithMany()
            .HasForeignKey(e => e.VideoAssetId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of an asset if it's associated with any exercise
    }
}
