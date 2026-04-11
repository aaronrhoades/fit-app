using System.ComponentModel.DataAnnotations;

namespace FitAppApi.Models;

public class Workout
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public List<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}