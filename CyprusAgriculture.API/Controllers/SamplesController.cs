using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SamplesController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<SamplesController> _logger;

        public SamplesController(CyprusAgricultureDbContext context, ILogger<SamplesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetSamples()
        {
            try
            {
            var samples = await _context.Samples
                .Include(s => s.Questionnaire)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.Description,
                    s.TargetSize,
                    s.Status,
                    s.CreatedAt,
                    s.CreatedBy,
                    QuestionnaireId = s.QuestionnaireId,
                    Questionnaire = s.Questionnaire != null ? new
                    {
                        s.Questionnaire.Id,
                        s.Questionnaire.Name
                    } : null,
                    FilterCriteria = s.FilterCriteria,
                    TotalFarms = _context.SampleParticipants.Count(sp => sp.SampleId == s.Id)
                })
                .ToListAsync();                return Ok(samples);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching samples");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateSample([FromBody] CreateSampleRequest request)
        {
            try
            {
            var sample = new Sample
            {
                Id = Guid.NewGuid(),
                QuestionnaireId = string.IsNullOrEmpty(request.QuestionnaireId) ? null : Guid.Parse(request.QuestionnaireId),
                Name = request.Name,
                Description = request.Description,
                TargetSize = request.SampleSize,
                FilterCriteria = System.Text.Json.JsonSerializer.Serialize(request.FilterCriteria ?? new FilterCriteria()),
                CreatedAt = DateTime.UtcNow,
                Status = "active",
                CreatedBy = string.IsNullOrEmpty(request.CreatedById) ? Guid.Parse("00000000-0000-0000-0000-000000000001") : Guid.Parse(request.CreatedById)
            };                _context.Samples.Add(sample);

                // Generate sample participants based on filter criteria
                var eligibleFarms = await GetEligibleFarms(request.FilterCriteria);
                var selectedFarms = SelectRandomFarms(eligibleFarms, request.SampleSize);

                // Temporarily comment out participants creation to test sample creation first
                /*
                foreach (var farm in selectedFarms)
                {
                    var participant = new SampleParticipant
                    {
                        Id = Guid.NewGuid(),
                        SampleId = sample.Id,
                        FarmId = farm.Id,
                        CreatedAt = DateTime.UtcNow,
                        Status = "active"
                    };
                    _context.SampleParticipants.Add(participant);
                }
                */

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Sample created successfully",
                    sample = new
                    {
                        sample.Id,
                        sample.Name,
                        sample.Description,
                        SampleSize = sample.TargetSize,
                        IsActive = sample.Status == "active",
                        sample.CreatedAt,
                        ParticipantsCount = selectedFarms.Count,
                        EligibleFarms = eligibleFarms.Count
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{sampleId}/farms")]
        public async Task<ActionResult<object>> GetSampleFarms(Guid sampleId)
        {
            try
            {
                var sample = await _context.Samples.FindAsync(sampleId);
                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }

                var farms = await _context.SampleParticipants
                    .Where(sp => sp.SampleId == sampleId)
                    .Include(sp => sp.Farm)
                    .Select(sp => new
                    {
                        sp.Farm!.Id,
                        sp.Farm.FarmCode,
                        sp.Farm.OwnerName,
                        sp.Farm.Province,
                        sp.Farm.Community,
                        sp.Farm.FarmType,
                        sp.Farm.TotalArea,
                        sp.Farm.EconomicSize,
                        sp.Farm.MainCrops,
                        sp.Farm.LivestockTypes,
                        sp.Farm.LegalStatus,
                        sp.Status,
                        sp.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    sampleId = sampleId,
                    sampleName = sample.Name,
                    farmsCount = farms.Count,
                    farms = farms
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sample farms");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{sampleId}/generate")]
        public async Task<ActionResult<object>> GenerateSampleParticipants(Guid sampleId)
        {
            try
            {
                var sample = await _context.Samples.FindAsync(sampleId);
                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }

                // Remove existing participants
                var existingParticipants = await _context.SampleParticipants
                    .Where(sp => sp.SampleId == sampleId)
                    .ToListAsync();
                _context.SampleParticipants.RemoveRange(existingParticipants);

                // Get filter criteria
                var filterCriteria = System.Text.Json.JsonSerializer.Deserialize<FilterCriteria>(sample.FilterCriteria ?? "{}");

                // Get eligible farms
                var eligibleFarms = await GetEligibleFarms(filterCriteria);
                var selectedFarms = SelectRandomFarms(eligibleFarms, sample.TargetSize);

                // Create new participants
                foreach (var farm in selectedFarms)
                {
                    var participant = new SampleParticipant
                    {
                        Id = Guid.NewGuid(),
                        SampleId = sampleId,
                        FarmId = farm.Id,
                        CreatedAt = DateTime.UtcNow,
                        Status = "active"
                    };
                    _context.SampleParticipants.Add(participant);
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Sample participants generated successfully",
                    participantsCount = selectedFarms.Count,
                    totalEligible = eligibleFarms.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating sample participants");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private async Task<List<Farm>> GetEligibleFarms(FilterCriteria? criteria)
        {
            var query = _context.Farms.Where(f => f.IsActive);

            if (criteria == null) return await query.ToListAsync();

            if (criteria.Provinces?.Any() == true)
            {
                query = query.Where(f => criteria.Provinces.Contains(f.Province));
            }

            if (criteria.Communities?.Any() == true)
            {
                query = query.Where(f => criteria.Communities.Contains(f.Community));
            }

            if (criteria.FarmTypes?.Any() == true)
            {
                query = query.Where(f => criteria.FarmTypes.Contains(f.FarmType));
            }

            if (criteria.MinimumArea.HasValue)
            {
                query = query.Where(f => f.TotalArea >= criteria.MinimumArea.Value);
            }

            if (criteria.MaximumArea.HasValue)
            {
                query = query.Where(f => f.TotalArea <= criteria.MaximumArea.Value);
            }

            return await query.ToListAsync();
        }

        [HttpPost("{sampleId}/assign")]
        public async Task<ActionResult<object>> AssignSample(Guid sampleId, [FromBody] AssignSampleRequest request)
        {
            try
            {
                var sample = await _context.Samples
                    .Include(s => s.Questionnaire)
                    .FirstOrDefaultAsync(s => s.Id == sampleId);

                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }

                // Remove existing assignments
                var existingAssignments = await _context.SampleAssignments
                    .Where(sa => sa.SampleId == sampleId)
                    .ToListAsync();

                if (existingAssignments.Any())
                {
                    _context.SampleAssignments.RemoveRange(existingAssignments);
                }

                // Create new assignments
                var assignments = new List<SampleAssignment>();
                foreach (var userId in request.UserIds)
                {
                    var assignment = new SampleAssignment
                    {
                        Id = Guid.NewGuid(),
                        SampleId = sampleId,
                        UserId = Guid.Parse(userId),
                        AssignedBy = Guid.Parse("00000000-0000-0000-0000-000000000001"), // System user
                        Notes = request.Notes,
                        Status = "assigned",
                        AssignedAt = DateTime.UtcNow,
                        Region = "" // Will be updated based on user region
                    };
                    assignments.Add(assignment);
                }

                _context.SampleAssignments.AddRange(assignments);
                
                // Update sample status
                sample.Status = "assigned";
                
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = $"Sample assigned to {request.UserIds.Count} users successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning sample");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("{sampleId}/unassign")]
        public async Task<ActionResult<object>> UnassignSample(Guid sampleId)
        {
            try
            {
                var sample = await _context.Samples.FindAsync(sampleId);
                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }

                // Remove all assignments
                var assignments = await _context.SampleAssignments
                    .Where(sa => sa.SampleId == sampleId)
                    .ToListAsync();

                _context.SampleAssignments.RemoveRange(assignments);
                
                // Update sample status
                sample.Status = "active";
                
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Sample unassigned successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error unassigning sample");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{sampleId}")]
        public async Task<ActionResult<object>> DeleteSample(Guid sampleId)
        {
            try
            {
                var sample = await _context.Samples.FindAsync(sampleId);
                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }

                // Remove assignments first
                var assignments = await _context.SampleAssignments
                    .Where(sa => sa.SampleId == sampleId)
                    .ToListAsync();
                _context.SampleAssignments.RemoveRange(assignments);

                // Remove participants
                var participants = await _context.SampleParticipants
                    .Where(sp => sp.SampleId == sampleId)
                    .ToListAsync();
                _context.SampleParticipants.RemoveRange(participants);

                // Remove sample
                _context.Samples.Remove(sample);
                
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Sample deleted successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sample");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        private List<Farm> SelectRandomFarms(List<Farm> eligibleFarms, int sampleSize)
        {
            if (eligibleFarms.Count <= sampleSize)
            {
                return eligibleFarms;
            }

            var random = new Random();
            return eligibleFarms.OrderBy(x => random.Next()).Take(sampleSize).ToList();
        }
    }

    public class CreateSampleRequest
    {
        public string? QuestionnaireId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int SampleSize { get; set; }
        public FilterCriteria? FilterCriteria { get; set; }
        public string? CreatedById { get; set; }
    }

    public class AssignSampleRequest
    {
        public List<string> UserIds { get; set; } = new();
        public string? DueDate { get; set; }
        public string? Notes { get; set; }
        public string Priority { get; set; } = "medium";
    }

    public class FilterCriteria
    {
        public List<string>? Provinces { get; set; }
        public List<string>? Communities { get; set; }
        public List<string>? FarmTypes { get; set; }
        public List<string>? SizeCategories { get; set; }
        public List<string>? EconomicSizes { get; set; }
        public List<string>? LegalStatuses { get; set; }
        public List<string>? MainCrops { get; set; }
        public List<string>? LivestockTypes { get; set; }
        public decimal? MinimumArea { get; set; }
        public decimal? MaximumArea { get; set; }
        public decimal? MinimumValue { get; set; }
        public decimal? MaximumValue { get; set; }
        public string? Priority { get; set; }
    }
}