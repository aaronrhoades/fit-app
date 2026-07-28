using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FitAppApi.Models;

namespace FitAppApi.Data.Configurations;

public class WorkoutConfiguration : IEntityTypeConfiguration<Workout>
{
    public void Configure(EntityTypeBuilder<Workout> builder)
    {
        builder.HasKey(w => w.Id);

        builder.Property(w => w.Title)
            .HasMaxLength(200);

        builder.Property(w => w.Description)
            .HasMaxLength(1000);

        builder.HasOne(w => w.ImageAsset)
            .WithMany()
            .HasForeignKey(w => w.ImageAssetId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of an asset if it's associated with any workout

        builder.HasMany(w => w.WorkoutExercises)
            .WithOne(we => we.Workout)
            .HasForeignKey(we => we.WorkoutId);
    }
}
