using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using FitAppApi.Models;
using FitAppApi.Services;

namespace FitAppApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WorkoutController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;
        public WorkoutController(IWorkoutService workoutService)
        {
            _workoutService = workoutService;
        }
        // GET: api/Workout
        [HttpGet]
        public async Task<IEnumerable<Workout>> Get()
        {
            return await _workoutService.GetAllAsync();
        }

        // GET: api/Workout/5
        [HttpGet("{id}")]
        public async Task<Workout?> Get(string id)
        {
            return await _workoutService.GetByIdAsync(Guid.Parse(id));
        }

        // POST: api/Workout
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Workout workout)
        {
            return await _workoutService.CreateAsync(workout) != null ? Ok(workout) : BadRequest();
        }

        // PUT: api/Workout/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Workout workout)
        {
            return await _workoutService.UpdateAsync(Guid.Parse(id), workout) != null ? Ok(workout) : NotFound();
        }

        // DELETE: api/Workout/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            Guid guid = Guid.Parse(id);
            if(guid == Guid.Empty)
            {
                return BadRequest("Invalid ID format");
            }
            return await _workoutService.DeleteAsync(guid) ? Ok() : NotFound();
        }
    }
}
