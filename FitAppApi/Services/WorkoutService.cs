using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FitAppApi.Models;
using Microsoft.EntityFrameworkCore;
using FitAppApi.Data;

namespace FitAppApi.Services
{
    public interface IWorkoutService
    {
        Task<IEnumerable<Workout>> GetAllAsync();
        Task<Workout?> GetByIdAsync(Guid id);
        Task<Workout> CreateAsync(Workout entity);
        Task<Workout> UpdateAsync(Guid id, Workout entity);
        Task<bool> DeleteAsync(Guid id);
    }

    public class WorkoutService : IWorkoutService
    {
        private readonly FitAppDbContext _context;
        public WorkoutService(FitAppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Workout>> GetAllAsync()
        {
            return await _context.Workouts
                .Include(w => w.WorkoutExercises.OrderBy(we => we.Order))        // Get the join table and order by the 'Order' property
                    .ThenInclude(we => we.Exercise)     // Get the actual Exercise details (Name, Image, etc.)
                .ToListAsync();
        }
        public async Task<Workout?> GetByIdAsync(Guid id)
        {
            return await _context.Workouts
                .Include(w => w.WorkoutExercises.OrderBy(we => we.Order))        // Get the join table and order by the 'Order' property
                    .ThenInclude(we => we.Exercise)     // Get the actual Exercise details (Name, Image, etc.)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task<Workout> CreateAsync(Workout entity)
        {
            _context.Workouts.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<Workout> UpdateAsync(Guid id, Workout entity)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                throw new InvalidOperationException("Workout not found");

            // Update the workout properties
            workout.Title = entity.Title;
            workout.Description = entity.Description;
            workout.ImageUrl = entity.ImageUrl;
            // Note: Updating WorkoutExercises is more complex and may require additional logic to handle additions, deletions, and updates of exercises within the workout. This example assumes you are only updating the workout's basic properties.

            // Update other properties as needed

            await _context.SaveChangesAsync();
            return workout;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                return false;

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}