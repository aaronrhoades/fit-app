namespace FitAppApi.Models;

public class Workout
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? Title { get; set; }
    public string? Description { get; set; }
    public List<Exercise>? Exercises { get; set; }
}