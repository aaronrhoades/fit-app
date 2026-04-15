using Microsoft.EntityFrameworkCore;
using FitAppApi.Models;

namespace FitAppApi.Data
{
    public class FitAppDbContext : DbContext
    {
        public FitAppDbContext(DbContextOptions<FitAppDbContext> options) 
            : base(options)
        {
        }

        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutExercise> WorkoutExercises { get; set; }
        public DbSet<Exercise> Exercises { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configure your entities here
            modelBuilder.Entity<Workout>()
                .HasMany(w => w.WorkoutExercises)
                .WithOne(we => we.Workout)
                .HasForeignKey(we => we.WorkoutId);

            modelBuilder.Entity<WorkoutExercise>()
                .HasOne(we => we.Exercise)
                .WithMany() // Assuming Exercise doesn't have a collection of WorkoutExercises
                .HasForeignKey(we => we.ExerciseId);
        }
    }
}