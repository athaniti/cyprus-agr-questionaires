using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json.Serialization;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionnairesController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<QuestionnairesController> _logger;

        public QuestionnairesController(CyprusAgricultureDbContext context, ILogger<QuestionnairesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/questionnaires
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaires(
            [FromQuery] string? status = null,
            [FromQuery] string? category = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                _logger.LogInformation("GetQuestionnaires called with status={Status}, category={Category}, page={Page}, pageSize={PageSize}", 
                    status, category, page, pageSize);
                
                var query = _context.Questionnaires.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(q => q.Status == status);
                }

                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(q => q.Category == category);
                }

                var totalCount = await query.CountAsync();
                var questionnaires = await query
                    .OrderByDescending(q => q.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(q => new
                    {
                        q.Id,
                        q.Name,
                        q.Description,
                        q.Category,
                        q.Status,
                        SerializedSchema = q.Schema,
                        q.TargetResponses,
                        q.CurrentResponses,
                        CompletionRate = q.TargetResponses > 0 ? (double)q.CurrentResponses / q.TargetResponses * 100 : 0,
                        CreatedBy = "System User", // Fallback when no user relation
                        q.CreatedAt,
                        q.PublishedAt,
                        q.UpdatedAt,
                        // Add sample information
                        SamplesCount = _context.Samples.Count(s => s.QuestionnaireId == q.Id),
                        Samples = _context.Samples
                            .Where(s => s.QuestionnaireId == q.Id)
                            .Select(s => new
                            {
                                s.Id,
                                s.Name,
                                s.TargetSize,
                                s.Status,
                                s.CreatedAt
                            })
                            .Take(3)
                            .ToList()
                    })
                    .ToListAsync();

                return Ok(new
                {
                    data = questionnaires,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving questionnaires");
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        // GET: api/questionnaires/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetQuestionnaire(Guid id)
        {
            try
            {
                var questionnaire = await _context.Questionnaires
                    .Include(q => q.Responses)
                    .Include(q => q.Quotas)
                    .FirstOrDefaultAsync(q => q.Id == id);

                if (questionnaire == null)
                {
                    return NotFound();
                }

                return Ok(new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Description,
                    questionnaire.Category,
                    questionnaire.Status,
                    SerializedSchema = questionnaire.Schema,
                    questionnaire.TargetResponses,
                    questionnaire.CurrentResponses,
                    CreatedBy = "System User", // Fallback since Creator relation might not be properly set up
                    questionnaire.CreatedAt,
                    questionnaire.PublishedAt,
                    questionnaire.UpdatedAt,
                    ResponseCount = questionnaire.Responses.Count,
                    Quotas = questionnaire.Quotas.Select(q => new
                    {
                        q.Id,
                        q.Region,
                        q.Municipality,
                        q.TargetCount,
                        q.CurrentCount,
                        q.Category
                    })
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/questionnaires
        [HttpPost]
        public async Task<ActionResult<object>> CreateQuestionnaire([FromBody] CreateOrUpdateQuestionnaireRequest request)
        {
            var userId = _context.Users.First().Id;
            try
            {
                var questionnaire = new Questionnaire
                {
                    Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    Schema = request.SerializedSchema,
                    TargetResponses = request.TargetResponses ?? 0,
                    CreatedBy = userId,
                    Status = "draft"
                };

                _context.Questionnaires.Add(questionnaire);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaire), new { id = questionnaire.Id }, new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Status,
                    questionnaire.CreatedAt,
                    questionnaire.Description,
                    questionnaire.Category,
                    questionnaire.TargetResponses,
                    SerializedScehma = questionnaire.Schema
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating questionnaire");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/questionnaires/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestionnaire(Guid id, [FromBody] CreateOrUpdateQuestionnaireRequest request)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(id);
                if (questionnaire == null)
                {
                    return NotFound();
                }

                questionnaire.Name = request.Name;
                questionnaire.Description = request.Description ;
                questionnaire.Category = request.Category;
                questionnaire.Schema = request.SerializedSchema;
                questionnaire.TargetResponses = request.TargetResponses ?? 0;
                questionnaire.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Status,
                    questionnaire.CreatedAt,
                    questionnaire.Description,
                    questionnaire.Category,
                    questionnaire.TargetResponses,
                    SerializedScehma = questionnaire.Schema
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }


        // DELETE: api/questionnaires/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuestionnaire(Guid id)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(id);
                if (questionnaire == null)
                {
                    return NotFound();
                }

                _context.Questionnaires.Remove(questionnaire);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/questionnaires/{id}/responses
        [HttpGet("{id}/responses")]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaireResponses(Guid id)
        {
            try
            {
                var responses = await _context.QuestionnaireResponses
                    .Where(r => r.QuestionnaireId == id)
                    .Select(r => new
                    {
                        r.Id,
                        r.Status,
                        r.StartedAt,
                        r.SubmittedAt,
                        r.CompletedAt,
                        r.FarmName,
                        r.Region,
                        r.Municipality,
                        UserName = "System User", // Fallback since User relation might not be properly set up
                        Email = "system@agriculture.gov.cy"
                    })
                    .ToListAsync();

                return Ok(responses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving responses for questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    // DTOs
    public class CreateOrUpdateQuestionnaireRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonPropertyName("category")]
        public string Category { get; set; } = string.Empty;

        [JsonPropertyName("serializedSchema")]
        public string SerializedSchema { get; set; } = string.Empty;

        [JsonPropertyName("targetResponses")]
        public int? TargetResponses { get; set; }
    }
}