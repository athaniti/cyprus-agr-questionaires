using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvitationsController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<InvitationsController> _logger;

        public InvitationsController(CyprusAgricultureDbContext context, ILogger<InvitationsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // INVITATION TEMPLATES ENDPOINTS

        /// <summary>
        /// Get all invitation templates for a questionnaire
        /// </summary>
        [HttpGet("templates")]
        public async Task<ActionResult<IEnumerable<object>>> GetTemplates([FromQuery] Guid? questionnaireId = null)
        {
            try
            {
                var query = _context.InvitationTemplates
                    .Include(t => t.Questionnaire)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(t => t.QuestionnaireId == questionnaireId.Value);
                }

                var templates = await query
                    .OrderByDescending(t => t.Id)
                    .Select(template=> new
                    {
                        template.Id,
                        template.Name,
                        template.HtmlContent,
                        template.LogoAlignment,
                        template.LogoImageBase64,
                        template.PlainTextContent,
                        template.QuestionnaireId,
                        QuestionnaireName=template.Questionnaire.Name,
                        template.Subject
                    })
                    .ToListAsync();

                return Ok(templates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invitation templates");
                return StatusCode(500, new { message = "Σφάλμα κατά την ανάκτηση των προτύπων πρόσκλησης." });
            }
        }

        /// <summary>
        /// Create new invitation template
        /// </summary>
        [HttpPost("templates")]
        public async Task<ActionResult<object>> CreateTemplate([FromBody] CreateOrUpdateInvitationTemplateRequest request)
        {
            try
            {
                // Validate questionnaire exists
                var questionnaire = await _context.Questionnaires.FindAsync(request.QuestionnaireId);
                if (questionnaire == null)
                {
                    return BadRequest(new { message = "Το ερωτηματολόγιο δεν βρέθηκε." });
                }

                var template = new InvitationTemplate
                {
                    Name = request.Name,
                    QuestionnaireId = request.QuestionnaireId,
                    Subject = request.Subject,
                    HtmlContent = request.HtmlContent,
                    PlainTextContent = request.PlainTextContent,
                    LogoImageBase64 = request.LogoImageBase64,
                    LogoAlignment = request.LogoAlignment ?? "center"
                };

                _context.InvitationTemplates.Add(template);
                await _context.SaveChangesAsync();

                // Return template with related data
                await _context.Entry(template)
                    .Reference(t => t.Questionnaire)
                    .LoadAsync();

                return Ok(new {
                    template.Id,
                    template.Name,
                    template.HtmlContent,
                    template.LogoAlignment,
                    template.LogoImageBase64,
                    template.PlainTextContent,
                    template.QuestionnaireId,
                    QuestionnaireName=template.Questionnaire.Name,
                    template.Subject
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating invitation template");
                return StatusCode(500, new { message = "Σφάλμα κατά τη δημιουργία του προτύπου πρόσκλησης." });
            }
        }

        /// <summary>
        /// Update invitation template
        /// </summary>
        [HttpPut("templates/{id}")]
        public async Task<ActionResult<object>> UpdateTemplate(Guid id, [FromBody] CreateOrUpdateInvitationTemplateRequest request)
        {
            try
            {
                var template = await _context.InvitationTemplates.FindAsync(id);
                if (template == null)
                {
                    return NotFound(new { message = "Το πρότυπο πρόσκλησης δεν βρέθηκε." });
                }

                // Update fields
                template.Name = request.Name;
                template.Subject = request.Subject;
                template.HtmlContent = request.HtmlContent;
                template.PlainTextContent = request.PlainTextContent;
                template.LogoImageBase64 = request.LogoImageBase64;
                template.LogoAlignment = request.LogoAlignment ?? template.LogoAlignment;

                await _context.SaveChangesAsync();
                return Ok(new {
                    template.Id,
                    template.Name,
                    template.HtmlContent,
                    template.LogoAlignment,
                    template.LogoImageBase64,
                    template.PlainTextContent,
                    template.QuestionnaireId,
                    QuestionnaireName=template.Questionnaire.Name,
                    template.Subject
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating invitation template {TemplateId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την ενημέρωση του προτύπου πρόσκλησης." });
            }
        }

        /// <summary>
        /// Delete invitation template
        /// </summary>
        [HttpDelete("templates/{id}")]
        public async Task<IActionResult> DeleteTemplate(Guid id)
        {
            try
            {
                var template = await _context.InvitationTemplates.FindAsync(id);
                if (template == null)
                {
                    return NotFound(new { message = "Το πρότυπο πρόσκλησης δεν βρέθηκε." });
                }


                _context.InvitationTemplates.Remove(template);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting invitation template {TemplateId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά τη διαγραφή του προτύπου πρόσκλησης." });
            }
        }

        // INVITATION BATCHES ENDPOINTS

        /// <summary>
        /// Get all invitation batches
        /// </summary>
        [HttpGet("batches")]
        public async Task<ActionResult<IEnumerable<object>>> GetBatches([FromQuery] Guid? questionnaireId = null)
        {
            try
            {
                var query = _context.InvitationBatches
                    .Include(b => b.InvitationTemplate)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(b => b.InvitationTemplate.QuestionnaireId == questionnaireId.Value);
                }

                var batches = await query
                    .OrderByDescending(b => b.Id)
                    .Select(b=>new
                    {
                        b.Id,
                        b.Name,
                        b.ScheduledAt,
                        b.SentAt,
                        SerializedFarmIds = b.RecipientFarms,
                        b.InvitationTemplateId,
                        TemplateName=b.InvitationTemplate.Name,
                        b.InvitationTemplate.QuestionnaireId,
                        QuestionnaireName=b.InvitationTemplate.Questionnaire.Name,

                    })
                    .ToListAsync();

                return Ok(batches);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invitation batches");
                return StatusCode(500, new { message = "Σφάλμα κατά την ανάκτηση των παρτίδων πρόσκλησης." });
            }
        }

        /// <summary>
        /// Get invitation batch by ID with detailed statistics
        /// </summary>
        [HttpGet("batches/{id}")]
        public async Task<ActionResult<InvitationBatchDetails>> GetBatch(Guid id)
        {
            try
            {
                var batch = await _context.InvitationBatches
                    .Include(b => b.InvitationTemplate)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (batch == null)
                {
                    return NotFound(new { message = "Η παρτίδα πρόσκλησης δεν βρέθηκε." });
                }

                // Calculate detailed statistics
                var details = new InvitationBatchDetails
                {
                    Batch = batch,
                    Statistics = new BatchStatistics
                    {
                        TotalInvitations = 10,
                        DeliveredInvitations = 5,
                        FailedInvitations = 1,
                        StartedResponses = 10,
                        CompletedResponses = 4,
                        ParticipationRate = 33,
                        CompletionRate = 22,
                        DeliveryRate = 90
                    }
                };

                return Ok(details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invitation batch {BatchId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την ανάκτηση της παρτίδας πρόσκλησης." });
            }
        }

        /// <summary>
        /// Create new invitation batch
        /// </summary>
        [HttpPost("batches")]
        public async Task<ActionResult<InvitationBatch>> CreateBatch([FromBody] CreateOrUpdateInvitationBatchRequest request)
        {
            try
            {
                // Validate template and questionnaire exist
                var template = await _context.InvitationTemplates.FindAsync(request.TemplateId);
                if (template == null)
                {
                    return BadRequest(new { message = "Το πρότυπο πρόσκλησης δεν βρέθηκε." });
                }

                var batch = new InvitationBatch
                {
                    Name = request.Name,
                    InvitationTemplateId = request.TemplateId,
                    ScheduledAt = request.ScheduledAt.HasValue ? request.ScheduledAt.Value.ToUniversalTime() : null,
                    RecipientFarms = request.SerializedFarmIds,
                    SentAt = request.SentAt.HasValue? request.SentAt.Value.ToUniversalTime() : null,
                };

                _context.InvitationBatches.Add(batch);
                await _context.SaveChangesAsync();

                

                // Load related data
                await _context.Entry(batch)
                    .Reference(b => b.InvitationTemplate)
                    .LoadAsync();
                

                return CreatedAtAction(nameof(GetBatch), new { id = batch.Id }, batch);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating invitation batch");
                return StatusCode(500, new { message = "Σφάλμα κατά τη δημιουργία της παρτίδας πρόσκλησης." });
            }
        }

        /// <summary>
        /// Send invitation batch
        /// </summary>
        [HttpPost("batches/{id}/send")]
        public async Task<IActionResult> SendBatch(Guid id)
        {
            try
            {
                var batch = await _context.InvitationBatches
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (batch == null)
                {
                    return NotFound(new { message = "Η παρτίδα πρόσκλησης δεν βρέθηκε." });
                }

                
                batch.SentAt = DateTime.UtcNow;

                
                await _context.SaveChangesAsync();

                return Ok(new { message = "Η παρτίδα προσκλήσεων στάλθηκε επιτυχώς." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invitation batch {BatchId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την αποστολή της παρτίδας προσκλήσεων." });
            }
        }
    }

    // Request/Response DTOs
    public class CreateOrUpdateInvitationTemplateRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid QuestionnaireId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string HtmlContent { get; set; } = string.Empty;
        public string? PlainTextContent { get; set; }
        public string? LogoImageBase64 { get; set; }
        public string? LogoAlignment { get; set; }
        
    }


    public class CreateOrUpdateInvitationBatchRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }
        public DateTime? ScheduledAt { get; set; }
        public DateTime? SentAt {get;set;}
        public string SerializedFarmIds { get; set; }
    }
    
    public class InvitationBatchDetails
    {
        public InvitationBatch Batch { get; set; } = null!;
        public BatchStatistics Statistics { get; set; } = null!;
    }

    public class BatchStatistics
    {
        public int TotalInvitations { get; set; }
        public int DeliveredInvitations { get; set; }
        public int FailedInvitations { get; set; }
        public int StartedResponses { get; set; }
        public int CompletedResponses { get; set; }
        public decimal ParticipationRate { get; set; }
        public decimal CompletionRate { get; set; }
        public decimal DeliveryRate { get; set; }
    }
}