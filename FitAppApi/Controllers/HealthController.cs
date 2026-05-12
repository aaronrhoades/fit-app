using Microsoft.AspNetCore.Mvc;

namespace FitAppApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealth()
        {
            // API health check for AWS
            return Ok(new { Status = "Healthy" });
        }
    }
}