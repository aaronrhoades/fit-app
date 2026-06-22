using Microsoft.EntityFrameworkCore;
using FitAppApi.Models;
using FitAppApi.Data.Configurations;

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
        public DbSet<Asset> Assets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(WorkoutConfiguration).Assembly); // Applies all configurations in the assembly
        }
    }
}