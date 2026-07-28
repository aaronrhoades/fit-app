using System.ComponentModel.DataAnnotations;

namespace FitAppApi.Models;

public class Workout
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Title { get; set; }
    public string? Description { get; set; }
    public Guid? ImageAssetId { get; set; }
    public Asset? ImageAsset { get; set; }
    public List<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}