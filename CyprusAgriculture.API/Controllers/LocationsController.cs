using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<LocationsController> _logger;

        public LocationsController(CyprusAgricultureDbContext context, ILogger<LocationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/locations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetLocations([FromQuery] string? type = null)
        {
            try
            {
                var query = _context.Locations.Where(l => l.IsActive);

                if (!string.IsNullOrEmpty(type))
                {
                    query = query.Where(l => l.Type == type);
                }

                var locations = await query
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Type,
                        l.ParentName,
                        l.ParentId,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving locations");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/regions
        [HttpGet("regions")]
        public async Task<ActionResult<IEnumerable<object>>> GetRegions()
        {
            try
            {
                var regions = await _context.Locations
                    .Where(l => l.Type == "region" && l.IsActive)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(regions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving regions");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/locations/{id}/children
        [HttpGet("{id}/children")]
        public async Task<ActionResult<IEnumerable<object>>> GetLocationChildren(Guid id)
        {
            try
            {
                var children = await _context.Locations
                    .Where(l => l.ParentId == id && l.IsActive)
                    .OrderBy(l => l.Name)
                    .Select(l => new
                    {
                        l.Id,
                        l.Name,
                        l.Type,
                        l.Code,
                        l.Latitude,
                        l.Longitude
                    })
                    .ToListAsync();

                return Ok(children);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving location children for {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}