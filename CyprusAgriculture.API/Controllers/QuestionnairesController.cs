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
            [FromQuery] string? userId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 100)
        {
            try
            {
                var query = _context.Questionnaires.AsQueryable();

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(q => q.Status == status);
                }
                if (!string.IsNullOrEmpty(userId))
                {
                    query = query.Where(q => q.Samples.Any(s=>s.SampleGroups.Any(sg=>sg.InterviewerId == Guid.Parse(userId))));
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
                        q.Status,
                        SerializedSchema = q.Schema,
                        ResponsesCount = q.Responses.Count,
                        CreatedBy = "System User", // Fallback when no user relation
                        q.CreatedAt,
                        q.UpdatedAt,
                        q.ThemeId
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
                    questionnaire.Status,
                    SerializedSchema = questionnaire.Schema,
                    ResponsesCount = questionnaire.Responses.Count,
                    CreatedBy = "System User", // Fallback when no user relation
                    questionnaire.CreatedAt,
                    questionnaire.UpdatedAt,
                    questionnaire.ThemeId
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
                    Schema = request.SerializedSchema,
                    ThemeId = request.ThemeId,
                    CreatedBy = userId,
                    Status = request.Status
                };

                _context.Questionnaires.Add(questionnaire);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetQuestionnaire), new { id = questionnaire.Id }, new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Description,
                    questionnaire.Status,
                    SerializedSchema = questionnaire.Schema,
                    ResponsesCount = questionnaire.Responses.Count,
                    CreatedBy = "System User", // Fallback when no user relation
                    questionnaire.CreatedAt,
                    questionnaire.UpdatedAt,
                    questionnaire.ThemeId
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
                questionnaire.Schema = request.SerializedSchema;
                questionnaire.ThemeId = request.ThemeId;
                questionnaire.Status = request.Status;
                questionnaire.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    questionnaire.Id,
                    questionnaire.Name,
                    questionnaire.Description,
                    questionnaire.Status,
                    SerializedSchema = questionnaire.Schema,
                    ResponsesCount = questionnaire.Responses.Count,
                    CreatedBy = "System User", // Fallback when no user relation
                    questionnaire.CreatedAt,
                    questionnaire.UpdatedAt,
                    questionnaire.ThemeId
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

        [HttpGet("{id}/responses")]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaireResponses(Guid id,
            [FromQuery] string? status = null,
            [FromQuery] string? province = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var query = _context.QuestionnaireResponses
                    .Include(fr => fr.Farm)
                    .Include(fr => fr.User)
                    .Where(fr => fr.QuestionnaireId == id);

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
                    .Select(qr => new
                    {
                        qr.Id,
                        qr.FarmId,
                        Farm = qr.Farm != null ? new
                        {
                            FarmCode = qr.Farm.FarmCode,
                            OwnerName = qr.Farm.OwnerName,
                            Province = qr.Farm.Province,
                            Community = qr.Farm.Community
                        } : null,
                        qr.Status,
                        qr.CompletionPercentage,
                        qr.UpdatedAt,
                        qr.CreatedAt,
                        qr.User,
                        qr.Notes,
                        SerializedResponseData = qr.ResponseData
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
                _logger.LogError(ex, "Error getting questionnaire responses for {QuestionnaireId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpGet("{id}/participants/{farmId}/response")]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaireParticipantResponse(Guid id, string farmId)
        {
            try
            {
                var qr = await _context.QuestionnaireResponses
                    .Include(qr => qr.Farm)
                    .Include(qr => qr.User)
                    .Where(qr => qr.QuestionnaireId == id && qr.FarmId == farmId).FirstOrDefaultAsync();

                if (qr == null)
                {
                    return NotFound(new { success = false, message = "Questionnaire response not found" });
                }
                
                return Ok(new
                    {
                        qr.Id,
                        qr.FarmId,
                        Farm = qr.Farm != null ? new
                        {
                            FarmCode = qr.Farm.FarmCode,
                            OwnerName = qr.Farm.OwnerName,
                            Province = qr.Farm.Province,
                            Community = qr.Farm.Community
                        } : null,
                        qr.Status,
                        qr.CompletionPercentage,
                        qr.UpdatedAt,
                        qr.CreatedAt,
                        qr.User,
                        SerializedResponseData = qr.ResponseData,
                        qr.Notes,
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting questionnaire response for {QuestionnaireId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        [HttpPost("{id}/participants/{farmId}/response")]
        public async Task<ActionResult<IEnumerable<object>>> CreateEmptyQuestionnaireParticipantResponse(Guid id, string farmId)
        {
            try
            {
                var qr = await _context.QuestionnaireResponses
                    .Include(qr => qr.Farm)
                    .Include(qr => qr.User)
                    .Where(qr => qr.QuestionnaireId == id && qr.FarmId == farmId).FirstOrDefaultAsync();

                if (qr != null)
                {
                    throw new InvalidOperationException("Response already exists");
                }

                var farm = await _context.Farms.FindAsync(farmId);
                if (farm == null)
                {
                    return NotFound("Farm not found");
                }
                
                var newResponse = new QuestionnaireResponse
                {
                    FarmId = farmId,
                    Status = "draft",
                    StartedAt = DateTime.UtcNow,
                    CreatedBy = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    QuestionnaireId = id,
                    UserId = Guid.Parse("11111111-1111-1111-1111-111111111111")
                };
                await _context.QuestionnaireResponses.AddAsync(newResponse);
                await _context.SaveChangesAsync();
                
                return Ok(new
                    {
                        newResponse.Id,
                        newResponse.FarmId,
                        Farm = farm != null ? new
                        {
                            FarmCode = farm.FarmCode,
                            OwnerName = farm.OwnerName,
                            Province = farm.Province,
                            Community = farm.Community
                        } : null,
                        newResponse.Status,
                        newResponse.CompletionPercentage,
                        newResponse.UpdatedAt,
                        newResponse.CreatedAt,
                        newResponse.User,
                        SerializedResponseData = newResponse.ResponseData,
                        newResponse.Notes,
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating questionnaire response for {QuestionnaireId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }


        [HttpPut("{id}/participants/{farmId}/response")]
        public async Task<ActionResult<IEnumerable<object>>> UpdateQuestionnaireParticipantResponse([FromRoute]Guid id, [FromRoute]string farmId, [FromBody]UpdateQuestionnaireResponseRequest responseRequest)
        {
            try
            {
                var qr = await _context.QuestionnaireResponses
                    .Include(qr => qr.Farm)
                    .Include(qr => qr.User)
                    .Where(qr => qr.QuestionnaireId == id && qr.FarmId == farmId).FirstOrDefaultAsync();

                if (qr == null)
                {
                    return NotFound(new { success = false, message = "Questionnaire response not found" });
                }
                
                qr.Notes = responseRequest.Notes;
                qr.Status = responseRequest.Status;
                qr.ResponseData = responseRequest.SerializedResponseData;
                qr.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                
                return Ok(new
                    {
                        qr.Id,
                        qr.FarmId,
                        Farm = qr.Farm != null ? new
                        {
                            FarmCode = qr.Farm.FarmCode,
                            OwnerName = qr.Farm.OwnerName,
                            Province = qr.Farm.Province,
                            Community = qr.Farm.Community
                        } : null,
                        qr.Status,
                        qr.CompletionPercentage,
                        qr.UpdatedAt,
                        qr.CreatedAt,
                        qr.User,
                        SerializedResponseData = qr.ResponseData,
                        qr.Notes,
                    });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating questionnaire response for {QuestionnaireId}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        
        [HttpGet("{id}/sample-groups")]
        public async Task<ActionResult<IEnumerable<object>>> GetQuestionnaireSampleGroups(Guid id, [FromQuery] string? userId = null)
        {
            var questionnaire = await _context.Questionnaires.FindAsync(id);
            if (questionnaire == null)
            {
                return NotFound(new { success = false, message = "Questionnaire not found" });
            }

            var groups = await _context.SampleGroups
                    .Where(sg => sg.Sample.QuestionnaireId == id && (userId == null || sg.InterviewerId == Guid.Parse(userId)))
                    .Include(sg => sg.Interviewer)
                    .Select(sg => new
                    {
                        sg.Id,
                        sg.Name,
                        sg.SampleId,
                        SampleName=sg.Sample!.Name,
                        sg.Sample!.QuestionnaireId,
                        QuestionnaireName=sg.Sample!.Questionnaire!.Name,
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
    }



    // DTOs
    public class CreateOrUpdateQuestionnaireRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("description")]
        public string? Description { get; set; }


        [JsonPropertyName("status")]
        public string Status { get; set; } = "active";

        [JsonPropertyName("serializedSchema")]
        public string SerializedSchema { get; set; } = string.Empty;

        [JsonPropertyName("themeId")]
        public Guid ThemeId {get;set;} = Guid.Empty;
    }

    public class UpdateQuestionnaireResponseRequest
    {
        public string SerializedResponseData { get; set; }
        public string Status { get; set; }
        public string? Notes {get;set;}
    }
}