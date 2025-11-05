using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormResponsesController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<FormResponsesController> _logger;

        public FormResponsesController(CyprusAgricultureDbContext context, ILogger<FormResponsesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/FormResponses/questionnaire/{questionnaireId}/schema
        [HttpGet("questionnaire/{questionnaireId}/schema")]
        public async Task<ActionResult<FormSchema>> GetQuestionnaireSchema(Guid questionnaireId)
        {
            try
            {
                var schema = await _context.FormSchemas
                    .Where(fs => fs.QuestionnaireId == questionnaireId && fs.IsActive)
                    .OrderByDescending(fs => fs.Version)
                    .FirstOrDefaultAsync();

                if (schema == null)
                {
                    return NotFound($"No active schema found for questionnaire {questionnaireId}");
                }

                return Ok(schema);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting questionnaire schema for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // POST: api/FormResponses/questionnaire/{questionnaireId}/schema
        [HttpPost("questionnaire/{questionnaireId}/schema")]
        public async Task<ActionResult<FormSchema>> SaveQuestionnaireSchema(Guid questionnaireId, [FromBody] SaveSchemaRequest request)
        {
            try
            {
                // Validate questionnaire exists
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                // Validate JSON schema
                try
                {
                    JsonDocument.Parse(request.SchemaJson);
                }
                catch (JsonException)
                {
                    return BadRequest("Invalid JSON schema format");
                }

                // Deactivate previous schemas
                var existingSchemas = await _context.FormSchemas
                    .Where(fs => fs.QuestionnaireId == questionnaireId && fs.IsActive)
                    .ToListAsync();

                foreach (var existing in existingSchemas)
                {
                    existing.IsActive = false;
                    existing.UpdatedAt = DateTime.UtcNow;
                    existing.UpdatedBy = request.CreatedBy;
                }

                // Create new schema
                var newVersion = existingSchemas.Count > 0 ? existingSchemas.Max(s => s.Version) + 1 : 1;
                
                var formSchema = new FormSchema
                {
                    QuestionnaireId = questionnaireId,
                    Name = request.Name,
                    SchemaJson = request.SchemaJson,
                    Version = newVersion,
                    IsActive = true,
                    CreatedBy = request.CreatedBy
                };

                _context.FormSchemas.Add(formSchema);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaireSchema), 
                    new { questionnaireId }, formSchema);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving questionnaire schema for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/FormResponses/farm/{farmId}/questionnaire/{questionnaireId}
        [HttpGet("farm/{farmId}/questionnaire/{questionnaireId}")]
        public async Task<ActionResult<FormResponse>> GetFarmResponse(string farmId, Guid questionnaireId)
        {
            try
            {
                var response = await _context.FormResponses
                    .FirstOrDefaultAsync(fr => fr.FarmId == farmId && fr.QuestionnaireId == questionnaireId);

                if (response == null)
                {
                    return NotFound($"No response found for farm {farmId} and questionnaire {questionnaireId}");
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting farm response for farm {FarmId}, questionnaire {QuestionnaireId}", 
                    farmId, questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // POST: api/FormResponses/farm/{farmId}/questionnaire/{questionnaireId}
        [HttpPost("farm/{farmId}/questionnaire/{questionnaireId}")]
        public async Task<ActionResult<FormResponse>> SaveFarmResponse(string farmId, Guid questionnaireId, 
            [FromBody] SaveResponseRequest request)
        {
            try
            {
                // Validate farm and questionnaire exist
                var farm = await _context.Farms.FindAsync(farmId);
                if (farm == null)
                {
                    return NotFound($"Farm {farmId} not found");
                }

                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                // Validate JSON response data
                try
                {
                    JsonDocument.Parse(request.ResponseData);
                }
                catch (JsonException)
                {
                    return BadRequest("Invalid JSON response data format");
                }

                // Check if response already exists
                var existingResponse = await _context.FormResponses
                    .FirstOrDefaultAsync(fr => fr.FarmId == farmId && fr.QuestionnaireId == questionnaireId);

                if (existingResponse != null)
                {
                    // Update existing response
                    existingResponse.ResponseData = request.ResponseData;
                    existingResponse.Status = request.Status ?? existingResponse.Status;
                    existingResponse.CompletionPercentage = request.CompletionPercentage ?? existingResponse.CompletionPercentage;
                    existingResponse.InterviewerId = request.InterviewerId ?? existingResponse.InterviewerId;
                    existingResponse.InterviewDate = request.InterviewDate ?? existingResponse.InterviewDate;
                    existingResponse.Notes = request.Notes ?? existingResponse.Notes;
                    existingResponse.UpdatedAt = DateTime.UtcNow;
                    existingResponse.UpdatedBy = request.UserId;

                    if (request.Status == "submitted" && existingResponse.SubmittedAt == null)
                    {
                        existingResponse.SubmittedAt = DateTime.UtcNow;
                    }

                    await _context.SaveChangesAsync();
                    return Ok(existingResponse);
                }
                else
                {
                    // Create new response
                    var formResponse = new FormResponse
                    {
                        FarmId = farmId,
                        QuestionnaireId = questionnaireId,
                        ResponseData = request.ResponseData,
                        Status = request.Status ?? "draft",
                        CompletionPercentage = request.CompletionPercentage ?? 0,
                        InterviewerId = request.InterviewerId,
                        InterviewDate = request.InterviewDate,
                        Notes = request.Notes,
                        CreatedBy = request.UserId
                    };

                    if (request.Status == "submitted")
                    {
                        formResponse.SubmittedAt = DateTime.UtcNow;
                    }

                    _context.FormResponses.Add(formResponse);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction(nameof(GetFarmResponse), 
                        new { farmId, questionnaireId }, formResponse);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving farm response for farm {FarmId}, questionnaire {QuestionnaireId}", 
                    farmId, questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/FormResponses/questionnaire/{questionnaireId}/responses
        [HttpGet("questionnaire/{questionnaireId}/responses")]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaireResponses(Guid questionnaireId,
            [FromQuery] string? status = null,
            [FromQuery] string? province = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.FormResponses
                    .Include(fr => fr.Farm)
                    .Where(fr => fr.QuestionnaireId == questionnaireId);

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(fr => fr.Status == status);
                }

                if (!string.IsNullOrEmpty(province))
                {
                    // Province filtering disabled temporarily due to database schema issues
                    // query = query.Where(fr => fr.Farm!.Province == province);
                }

                var totalCount = await query.CountAsync();
                
                var responses = await query
                    .OrderByDescending(fr => fr.UpdatedAt ?? fr.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(fr => new
                    {
                        fr.Id,
                        fr.FarmId,
                        Farm = fr.Farm != null ? new
                        {
                            FarmCode = fr.Farm.FarmCode,
                            OwnerName = fr.Farm.OwnerName,
                            Province = fr.Farm.Province,
                            Community = fr.Farm.Community
                        } : null,
                        fr.Status,
                        fr.CompletionPercentage,
                        fr.SubmittedAt,
                        fr.UpdatedAt,
                        fr.CreatedAt,
                        fr.Notes,
                        fr.ResponseData
                    })
                    .ToListAsync();

                return Ok(new
                {
                    responses,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting questionnaire responses for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    // DTOs
    public class SaveSchemaRequest
    {
        public string Name { get; set; } = string.Empty;
        public string SchemaJson { get; set; } = string.Empty;
        public Guid CreatedBy { get; set; }
    }

    public class SaveResponseRequest
    {
        public string ResponseData { get; set; } = string.Empty;
        public string? Status { get; set; }
        public decimal? CompletionPercentage { get; set; }
        public Guid? InterviewerId { get; set; }
        public DateTime? InterviewDate { get; set; }
        public string? Notes { get; set; }
        public Guid UserId { get; set; }
    }
}