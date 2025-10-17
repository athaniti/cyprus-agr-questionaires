using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResponsesController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<ResponsesController> _logger;

        public ResponsesController(CyprusAgricultureDbContext context, ILogger<ResponsesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/responses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetResponses(
            [FromQuery] Guid? questionnaireId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? region = null)
        {
            try
            {
                var query = _context.QuestionnaireResponses
                    .Include(r => r.Questionnaire)
                    .Include(r => r.User)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(r => r.QuestionnaireId == questionnaireId.Value);
                }

                if (!string.IsNullOrEmpty(status))
                {
                    query = query.Where(r => r.Status == status);
                }

                if (!string.IsNullOrEmpty(region))
                {
                    query = query.Where(r => r.Region == region);
                }

                var responses = await query
                    .OrderByDescending(r => r.StartedAt)
                    .Select(r => new
                    {
                        r.Id,
                        r.QuestionnaireId,
                        QuestionnaireName = r.Questionnaire.Name,
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
                _logger.LogError(ex, "Error retrieving responses");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/responses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetResponse(Guid id)
        {
            try
            {
                var response = await _context.QuestionnaireResponses
                    .Include(r => r.Questionnaire)
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (response == null)
                {
                    return NotFound();
                }

                return Ok(new
                {
                    response.Id,
                    response.QuestionnaireId,
                    QuestionnaireName = response.Questionnaire.Name,
                    response.ResponseData,
                    response.Status,
                    response.StartedAt,
                    response.SubmittedAt,
                    response.CompletedAt,
                    response.FarmName,
                    response.Region,
                    response.Municipality,
                    response.PostalCode,
                    response.Latitude,
                    response.Longitude,
                    UserName = response.User.FirstName + " " + response.User.LastName,
                    response.User.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving response {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/responses
        [HttpPost]
        public async Task<ActionResult<object>> CreateResponse([FromBody] CreateResponseRequest request)
        {
            try
            {
                var response = new QuestionnaireResponse
                {
                    QuestionnaireId = request.QuestionnaireId,
                    UserId = request.UserId, // In real app, get from JWT token
                    ResponseData = request.ResponseData ?? "{}",
                    Status = "draft",
                    FarmName = request.FarmName,
                    Region = request.Region,
                    Municipality = request.Municipality,
                    PostalCode = request.PostalCode,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude
                };

                _context.QuestionnaireResponses.Add(response);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetResponse), new { id = response.Id }, new
                {
                    response.Id,
                    response.Status,
                    response.StartedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating response");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/responses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResponse(Guid id, [FromBody] UpdateResponseRequest request)
        {
            try
            {
                var response = await _context.QuestionnaireResponses.FindAsync(id);
                if (response == null)
                {
                    return NotFound();
                }

                response.ResponseData = request.ResponseData ?? response.ResponseData;
                response.Status = request.Status ?? response.Status;
                response.FarmName = request.FarmName ?? response.FarmName;
                response.Region = request.Region ?? response.Region;
                response.Municipality = request.Municipality ?? response.Municipality;
                response.PostalCode = request.PostalCode ?? response.PostalCode;
                response.Latitude = request.Latitude ?? response.Latitude;
                response.Longitude = request.Longitude ?? response.Longitude;

                if (request.Status == "submitted" && response.SubmittedAt == null)
                {
                    response.SubmittedAt = DateTime.UtcNow;
                }

                if (request.Status == "completed" && response.CompletedAt == null)
                {
                    response.CompletedAt = DateTime.UtcNow;
                    
                    // Update questionnaire response count
                    var questionnaire = await _context.Questionnaires.FindAsync(response.QuestionnaireId);
                    if (questionnaire != null)
                    {
                        questionnaire.CurrentResponses++;
                        await _context.SaveChangesAsync();
                    }
                }

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating response {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/responses/{id}/submit
        [HttpPost("{id}/submit")]
        public async Task<IActionResult> SubmitResponse(Guid id)
        {
            try
            {
                var response = await _context.QuestionnaireResponses.FindAsync(id);
                if (response == null)
                {
                    return NotFound();
                }

                response.Status = "submitted";
                response.SubmittedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting response {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/responses/summary
        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetResponsesSummary()
        {
            try
            {
                var summary = await _context.QuestionnaireResponses
                    .GroupBy(r => r.Region)
                    .Select(g => new
                    {
                        Region = g.Key,
                        TotalResponses = g.Count(),
                        CompletedResponses = g.Count(r => r.Status == "completed"),
                        DraftResponses = g.Count(r => r.Status == "draft"),
                        SubmittedResponses = g.Count(r => r.Status == "submitted")
                    })
                    .ToListAsync();

                var overallSummary = new
                {
                    TotalResponses = await _context.QuestionnaireResponses.CountAsync(),
                    CompletedResponses = await _context.QuestionnaireResponses.CountAsync(r => r.Status == "completed"),
                    ActiveQuestionnaires = await _context.Questionnaires.CountAsync(q => q.Status == "active"),
                    RegionalSummary = summary
                };

                return Ok(overallSummary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving responses summary");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    // DTOs
    public class CreateResponseRequest
    {
        public Guid QuestionnaireId { get; set; }
        public Guid UserId { get; set; }
        public string? ResponseData { get; set; }
        public string? FarmName { get; set; }
        public string? Region { get; set; }
        public string? Municipality { get; set; }
        public string? PostalCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class UpdateResponseRequest
    {
        public string? ResponseData { get; set; }
        public string? Status { get; set; }
        public string? FarmName { get; set; }
        public string? Region { get; set; }
        public string? Municipality { get; set; }
        public string? PostalCode { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}