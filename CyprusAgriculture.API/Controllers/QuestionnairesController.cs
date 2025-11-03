using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

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
                    .Include(q => q.Creator)
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
                    questionnaire.Schema,
                    questionnaire.TargetResponses,
                    questionnaire.CurrentResponses,
                    CreatedBy = questionnaire.Creator.FirstName + " " + questionnaire.Creator.LastName,
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
        public async Task<ActionResult<object>> CreateQuestionnaire([FromBody] CreateQuestionnaireRequest request)
        {
            try
            {
                var questionnaire = new Questionnaire
                {
                    Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    Schema = request.Schema ?? "{}",
                    TargetResponses = request.TargetResponses,
                    CreatedBy = request.CreatedBy, // In real app, get from JWT token
                    Status = "draft"
                };

                _context.Questionnaires.Add(questionnaire);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaire), new { id = questionnaire.Id }, new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Status,
                    questionnaire.CreatedAt
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
        public async Task<IActionResult> UpdateQuestionnaire(Guid id, [FromBody] UpdateQuestionnaireRequest request)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(id);
                if (questionnaire == null)
                {
                    return NotFound();
                }

                questionnaire.Name = request.Name ?? questionnaire.Name;
                questionnaire.Description = request.Description ?? questionnaire.Description;
                questionnaire.Category = request.Category ?? questionnaire.Category;
                questionnaire.Schema = request.Schema ?? questionnaire.Schema;
                questionnaire.TargetResponses = request.TargetResponses ?? questionnaire.TargetResponses;
                questionnaire.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/questionnaires/{id}/publish
        [HttpPut("{id}/publish")]
        public async Task<IActionResult> PublishQuestionnaire(Guid id)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(id);
                if (questionnaire == null)
                {
                    return NotFound();
                }

                questionnaire.Status = "active";
                questionnaire.PublishedAt = DateTime.UtcNow;
                questionnaire.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing questionnaire {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/questionnaires/{id}/duplicate
        [HttpPost("{id}/duplicate")]
        public async Task<ActionResult<object>> DuplicateQuestionnaire(Guid id)
        {
            try
            {
                var originalQuestionnaire = await _context.Questionnaires.FindAsync(id);
                if (originalQuestionnaire == null)
                {
                    return NotFound();
                }

                var duplicatedQuestionnaire = new Questionnaire
                {
                    Name = $"{originalQuestionnaire.Name} (Copy)",
                    Description = originalQuestionnaire.Description,
                    Category = originalQuestionnaire.Category,
                    Schema = originalQuestionnaire.Schema,
                    TargetResponses = originalQuestionnaire.TargetResponses,
                    CreatedBy = originalQuestionnaire.CreatedBy,
                    Status = "draft"
                };

                _context.Questionnaires.Add(duplicatedQuestionnaire);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaire), new { id = duplicatedQuestionnaire.Id }, new
                {
                    duplicatedQuestionnaire.Id,
                    duplicatedQuestionnaire.Name,
                    duplicatedQuestionnaire.Status,
                    duplicatedQuestionnaire.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error duplicating questionnaire {Id}", id);
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
                    .Include(r => r.User)
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
                        UserName = r.User.FirstName + " " + r.User.LastName,
                        r.User.Email
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

        // GET: api/questionnaires/{id}/schema
        [HttpGet("{id}/schema")]
        public async Task<ActionResult<object>> GetQuestionnaireSchema(Guid id)
        {
            try
            {
                var questionnaire = await _context.Questionnaires
                    .Where(q => q.Id == id)
                    .Select(q => new { q.Id, q.Name, q.Schema, q.UpdatedAt })
                    .FirstOrDefaultAsync();

                if (questionnaire == null)
                {
                    return NotFound(new { error = "Questionnaire not found" });
                }

                return Ok(new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    Schema = System.Text.Json.JsonSerializer.Deserialize<object>(questionnaire.Schema),
                    questionnaire.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving schema for questionnaire {Id}", id);
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        // PUT: api/questionnaires/{id}/schema
        [HttpPut("{id}/schema")]
        public async Task<IActionResult> UpdateQuestionnaireSchema(Guid id, [FromBody] UpdateSchemaRequest request)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(id);
                if (questionnaire == null)
                {
                    return NotFound(new { error = "Questionnaire not found" });
                }

                // Validate that the schema is valid JSON
                try
                {
                    System.Text.Json.JsonSerializer.Deserialize<object>(request.Schema);
                }
                catch (System.Text.Json.JsonException)
                {
                    return BadRequest(new { error = "Invalid JSON schema format" });
                }

                questionnaire.Schema = request.Schema;
                questionnaire.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                _logger.LogInformation("Schema updated for questionnaire {Id}", id);

                return Ok(new
                {
                    message = "Schema updated successfully",
                    questionnaire.Id,
                    questionnaire.UpdatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating schema for questionnaire {Id}", id);
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }

        // POST: api/questionnaires/schema
        [HttpPost("schema")]
        public async Task<ActionResult<object>> CreateQuestionnaireWithSchema([FromBody] CreateQuestionnaireWithSchemaRequest request)
        {
            try
            {
                // Validate that the schema is valid JSON
                try
                {
                    System.Text.Json.JsonSerializer.Deserialize<object>(request.Schema);
                }
                catch (System.Text.Json.JsonException)
                {
                    return BadRequest(new { error = "Invalid JSON schema format" });
                }

                var questionnaire = new Questionnaire
                {
                    Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    Schema = request.Schema,
                    TargetResponses = request.TargetResponses,
                    CreatedBy = request.CreatedBy, // In real app, get from JWT token
                    Status = "draft"
                };

                _context.Questionnaires.Add(questionnaire);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Questionnaire created with schema: {Id}", questionnaire.Id);

                return CreatedAtAction(nameof(GetQuestionnaire), new { id = questionnaire.Id }, new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Status,
                    questionnaire.CreatedAt,
                    message = "Questionnaire created successfully with FormIO schema"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating questionnaire with schema");
                return StatusCode(500, new { error = "Internal server error", details = ex.Message });
            }
        }
    }

    // DTOs
    public class CreateQuestionnaireRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? Schema { get; set; }
        public int TargetResponses { get; set; }
        public Guid CreatedBy { get; set; }
    }

    public class UpdateQuestionnaireRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? Schema { get; set; }
        public int? TargetResponses { get; set; }
    }

    public class CreateQuestionnaireWithSchemaRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string Schema { get; set; } = "{}";
        public int TargetResponses { get; set; } = 0;
        public Guid CreatedBy { get; set; }
    }

    public class UpdateSchemaRequest
    {
        public string Schema { get; set; } = string.Empty;
    }
}