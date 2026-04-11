using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FitAppApi.Models;

public class WorkoutExercise
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public int? Repetitions { get; set; }
    public int? LengthSeconds { get; set; }
    public int? PreCounterSeconds { get; set; } = 5;
    public Guid WorkoutId { get; set; }
    [JsonIgnore] // Prevent circular reference during JSON serialization
    public Workout Workout { get; set; } = null!;
    public Guid ExerciseId { get; set; }
    public Exercise Exercise { get; set; } = null!;
    public int Order { get; set; } = 0;
}