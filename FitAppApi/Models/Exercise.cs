using System.ComponentModel.DataAnnotations;

namespace FitAppApi.Models;
public enum ExerciseType
{
    Strength,
    Cardio,
    Rest,
    Stretch
}
public class Exercise
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ExerciseType Type { get; set; }
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
}