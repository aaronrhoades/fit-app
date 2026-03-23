using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FitAppApi.Models;

namespace FitAppApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        // GET: api/Workout
        [HttpGet]
        public IEnumerable<Workout> Get()
        {
            // TODO: Implement logic to retrieve workouts from the database
            Workout workout1 = new Workout
            {
                Id = Guid.NewGuid(),
                Title = "Full Body Workout",
                Description = "A workout that targets all major muscle groups.",
                Exercises = new List<Exercise>
                {
                    new Exercise { Id = Guid.NewGuid(), Title = "Push-ups", Description = "A basic upper body exercise." },
                    new Exercise { Id = Guid.NewGuid(), Title = "Squats", Description = "A fundamental lower body exercise." }
                }
            };
            var workouts = new List<Workout>
            {
                workout1,
                new Workout { Id = Guid.NewGuid(), Title = "Workout 1", Description = "Description for Workout 1" },
                new Workout { Id = Guid.NewGuid(), Title = "Workout 2", Description = "Description for Workout 2" }
            };

            return workouts;
        }

        // GET: api/Workout/5
        [HttpGet("{id}")]
        public Workout Get(string id)
        {
            var pushUps = new Exercise { Id = Guid.NewGuid(), Title = "Push-ups", Description = "A basic upper body exercise." };
            var squats = new Exercise { Id = Guid.NewGuid(), Title = "Squats", Description = "A fundamental lower body exercise." };

            Workout workout1 = new Workout
            {
                Id = Guid.NewGuid(),
                Title = "Full Body Workout",
                Description = "A workout that targets all major muscle groups.",
                Exercises = new List<Exercise>
                {
                    pushUps,
                    squats,
                    pushUps,
                    squats,
                    pushUps,
                    squats
                }
            };
            // TODO: Implement logic to retrieve a specific workout from the database
            return workout1;
        }

        // POST: api/Workout
        [HttpPost]
        public IActionResult Post([FromBody] Workout workout)
        {

            return Ok();
        }

        // PUT: api/Workout/5
        [HttpPut("{id}")]
        public void Put(string id, [FromBody] Workout workout)
        {
        }

        // DELETE: api/Workout/5
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            return Ok();
        }
    }
}
