using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json.Serialization;

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
                    s.CreatedAt,
                    s.CreatedBy,
                    s.QuestionnaireId,
                    Questionnaire = s.Questionnaire != null ? new
                    {
                        s.Questionnaire.Id,
                        s.Questionnaire.Name
                    } : null,
                    SerializedFilterCriteria = s.FilterCriteria,
                    ParticipantsCount = s.Participants.Count,
                })
                .ToListAsync();
                return Ok(samples);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching samples");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetSample(Guid id)
        {
            try
            {
                var sample = await _context.Samples
                    .Include(s => s.Questionnaire)
                    .FirstOrDefaultAsync(s => s.Id == id);
                if (sample == null)
                {
                    return NotFound(new { success = false, message = "Sample not found" });
                }
                return Ok(new
                    {
                        sample.Id,
                        sample.Name,
                        sample.Description,
                        sample.TargetSize,
                        sample.CreatedAt,
                        sample.CreatedBy,
                        sample.QuestionnaireId,
                        Questionnaire = sample.Questionnaire != null ? new
                        {
                            sample.Questionnaire.Id,
                            sample.Questionnaire.Name
                        } : null,
                        SerializedFilterCriteria = sample.FilterCriteria,
                        ParticipantsCount = sample.Participants.Count,
                    });               
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
            var userId = _context.Users.First().Id;
            var questionnaire = await _context.Questionnaires.FindAsync(request.QuestionnaireId);
            if (questionnaire == null)
            {
                return NotFound(new { success = false, message = "Invalid QuestionnaireId" });
            }
            try
            {
                var sample = new Sample
                {
                    Id = Guid.NewGuid(),
                    QuestionnaireId = questionnaire.Id,
                    Name = request.Name,
                    Description = request.Description,
                    TargetSize = request.TargetSize,
                    FilterCriteria = request.SerializedFilterCriteria,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId
                };               
                _context.Samples.Add(sample);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSample), new { id = sample.Id }, new
                    {
                        sample.Id,
                        sample.Name,
                        sample.Description,
                        sample.TargetSize,
                        sample.CreatedAt,
                        sample.CreatedBy,
                        sample.QuestionnaireId,
                        Questionnaire = sample.Questionnaire != null ? new
                        {
                            sample.Questionnaire.Id,
                            sample.Questionnaire.Name
                        } : null,
                        SerializedFilterCriteria = sample.FilterCriteria,
                        ParticipantsCount = sample.Participants.Count,
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample");
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
                // var assignments = await _context.SampleAssignments
                //     .Where(sa => sa.SampleId == sampleId)
                //     .ToListAsync();
                // _context.SampleAssignments.RemoveRange(assignments);

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

        [HttpPost("{sampleId}/participants")]
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
                        CreatedAt = DateTime.UtcNow
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

        [HttpGet("{sampleId}/participants")]
        public async Task<ActionResult<object>> GetSampleParticipants(Guid sampleId)
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
                        sp.CreatedAt
                    })
                    .ToListAsync();

                return Ok(farms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sample farms");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        
        [HttpGet("{sampleId}/sample-groups")]
        public async Task<ActionResult<IEnumerable<object>>> GetSampleGroups(Guid sampleId)
        {
            var sample = await _context.Samples.FindAsync(sampleId);
            if (sample == null)
            {
                return NotFound(new { success = false, message = "Sample not found" });
            }

            var groups = await _context.SampleGroups
                    .Where(sg => sg.SampleId == sampleId)
                    .Include(sg => sg.Interviewer)
                    .Select(sg => new
                    {
                        sg.Id,
                        sg.Name,
                        sg.Description,
                        SerializedCritera = sg.Criteria,
                        SerializedFarmIds = sg.FarmIds,
                        sg.CreatedAt,
                        sg.InterviewerId
                    })
                    .OrderBy(sg=>sg.CreatedAt)
                    .ToListAsync();

                return Ok(groups);

        }

        [HttpPost("{sampleId}/sample-groups")]
        public async Task<ActionResult<object>> CreateSampleGroup(Guid sampleId, SampleGroupRequest request)
        {
            var userId = _context.Users.First().Id;
            var sample = await _context.Samples.FindAsync(sampleId);
            if (sample == null)
            {
                return NotFound(new { success = false, message = "Invalid Sample" });
            }
            try
            {
                var sampleGroup = new SampleGroup
                {
                    Id = Guid.NewGuid(),
                    SampleId = sample.Id,
                    Name = request.Name,
                    Description = request.Description,
                    InterviewerId = request.InterviewerId,
                    Criteria =  request.SerializedCriteria,
                    FarmIds = request.SerializedFarmIds,
                    CreatedAt = DateTime.UtcNow,
                    CreatedBy = userId
                };               
                _context.SampleGroups.Add(sampleGroup);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSample), new { id = sample.Id }, new
                    {
                        sampleGroup.Id,
                        sampleGroup.Name,
                        sampleGroup.Description,
                        SerializedCritera = sampleGroup.Criteria,
                        SerializedFarmIds = sampleGroup.FarmIds,
                        sampleGroup.CreatedAt,
                        sampleGroup.InterviewerId
                    }
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample group");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("{sampleId}/sample-groups/{id}")]
        public async Task<ActionResult<object>> UpdateSampleGroup(Guid sampleId, Guid id, SampleGroupRequest request)
        {
            var sampleGroup = await _context.SampleGroups.FindAsync(id);
            if (sampleGroup == null)
            {
                return NotFound(new { success = false, message = "Invalid Sample Group" });
            }
            if (sampleGroup.SampleId != sampleId)
            {
                return NotFound(new { success = false, message = "Invalid Sample" });
            }
            try
            {
                sampleGroup.Name = request.Name;
                sampleGroup.Description = request.Description;
                sampleGroup.InterviewerId = request.InterviewerId;
                sampleGroup.Criteria = request.SerializedCriteria;
                sampleGroup.FarmIds = request.SerializedFarmIds;
                
                await _context.SaveChangesAsync();
                return Ok(sampleGroup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating sample group");
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{sampleId}/sample-groups/{id}")]
        public async Task<ActionResult<object>> DeleteSampleGroup(Guid sampleId, Guid id)
        {
            var sampleGroup = await _context.SampleGroups.FindAsync(id);
            if (sampleGroup == null)
            {
                return NotFound(new { success = false, message = "Invalid Sample Group" });
            }
            if (sampleGroup.SampleId != sampleId)
            {
                return NotFound(new { success = false, message = "Invalid Sample" });
            }
            try
            {
                _context.SampleGroups.Remove(sampleGroup);
                
                await _context.SaveChangesAsync();
                return Ok(sampleGroup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sample group");
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

            return await query.ToListAsync();
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
        public Guid QuestionnaireId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int TargetSize { get; set; }
        public string SerializedFilterCriteria { get; set; } = "{}";
        
    }

    public class SampleGroupRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public object? Criteria { get; set; }
        public Guid? InterviewerId { get; set; }

        public string SerializedCriteria {get;set;} = "{}";
        public string SerializedFarmIds { get; set; } = "[]";
    }

    public class FilterCriteria
    {
        [JsonPropertyName("provinces")]
        public List<string>? Provinces { get; set; }

        [JsonPropertyName("communities")]
        public List<string>? Communities { get; set; }

        [JsonPropertyName("farmTypes")]
        public List<string>? FarmTypes { get; set; }

        [JsonPropertyName("sizeCategories")]
        public List<string>? SizeCategories { get; set; }

        [JsonPropertyName("economicSizes")]
        public List<string>? EconomicSizes { get; set; }
    }
}