using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SimpleSamplesController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<SimpleSamplesController> _logger;

        public SimpleSamplesController(CyprusAgricultureDbContext context, ILogger<SimpleSamplesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("test")]
        public async Task<ActionResult<object>> CreateTestSample([FromBody] TestSampleRequest request)
        {
            try
            {
                // Απλή δημιουργία sample χωρίς foreign keys
                var sampleId = Guid.NewGuid();
                var createdBy = Guid.NewGuid();
                var createdAt = DateTime.UtcNow;

                var sql = @"
                    INSERT INTO samples (id, name, description, target_size, current_size, status, filter_criteria, questionnaire_id, created_by, created_at)
                    VALUES (@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9)";

                await _context.Database.ExecuteSqlRawAsync(sql,
                    sampleId,
                    request.Name,
                    request.Description,
                    request.SampleSize,
                    0, // current_size
                    "active",
                    "{}",
                    DBNull.Value, // questionnaire_id
                    createdBy,
                    createdAt);

                // Βρες eligible farms
                var eligibleFarms = await _context.Farms
                    .Where(f => f.IsActive && 
                               (request.Province == null || f.Province == request.Province) &&
                               (request.FarmType == null || f.FarmType == request.FarmType))
                    .Take(request.SampleSize)
                    .Select(f => new { f.Id, f.OwnerName, f.Province, f.Community, f.FarmType })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    message = "Test sample created successfully",
                    sample = new
                    {
                        Id = sampleId,
                        Name = request.Name,
                        Description = request.Description,
                        SampleSize = request.SampleSize,
                        CreatedAt = createdAt,
                        EligibleFarms = eligibleFarms.Count,
                        SelectedFarms = eligibleFarms
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating test sample");
                return StatusCode(500, new { success = false, message = ex.Message, details = ex.ToString() });
            }
        }

        [HttpGet("test")]
        public async Task<ActionResult<object>> GetTestSamples()
        {
            try
            {
                var samples = await _context.Database.SqlQueryRaw<dynamic>(
                    "SELECT id, name, description, target_size, status, created_at FROM samples LIMIT 10")
                    .ToListAsync();

                return Ok(new { success = true, samples });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting test samples");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }

    public class TestSampleRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int SampleSize { get; set; }
        public string? Province { get; set; }
        public string? FarmType { get; set; }
    }
}