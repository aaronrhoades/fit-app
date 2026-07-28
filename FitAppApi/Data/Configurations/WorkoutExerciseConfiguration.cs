using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using FitAppApi.Models;

namespace FitAppApi.Data.Configurations;

public class WorkoutExerciseConfiguration : IEntityTypeConfiguration<WorkoutExercise>
{
    public void Configure(EntityTypeBuilder<WorkoutExercise> builder)
    {
        builder.HasKey(we => we.Id);

        builder.Property(we => we.Order)
            .IsRequired();

        builder.Property(we => we.PreCounterSeconds)
            .HasDefaultValue(5);

        builder.HasOne(we => we.Workout)
            .WithMany(w => w.WorkoutExercises)
            .HasForeignKey(we => we.WorkoutId)
            .OnDelete(DeleteBehavior.Cascade); // When a workout is deleted, its associated workout exercises will also be deleted

        builder.HasOne(we => we.Exercise)
            .WithMany()
            .HasForeignKey(we => we.ExerciseId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent deletion of an exercise if it's associated with any workout exercise
    }
}
