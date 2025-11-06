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
        public async Task<ActionResult<IEnumerable<InvitationTemplate>>> GetTemplates([FromQuery] Guid? questionnaireId = null)
        {
            try
            {
                var query = _context.InvitationTemplates
                    .Include(t => t.Questionnaire)
                    .Include(t => t.Creator)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(t => t.QuestionnaireId == questionnaireId.Value);
                }

                var templates = await query
                    .OrderByDescending(t => t.CreatedAt)
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
        /// Get invitation template by ID
        /// </summary>
        [HttpGet("templates/{id}")]
        public async Task<ActionResult<InvitationTemplate>> GetTemplate(Guid id)
        {
            try
            {
                var template = await _context.InvitationTemplates
                    .Include(t => t.Questionnaire)
                    .Include(t => t.Creator)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (template == null)
                {
                    return NotFound(new { message = "Το πρότυπο πρόσκλησης δεν βρέθηκε." });
                }

                return Ok(template);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving invitation template {TemplateId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την ανάκτηση του προτύπου πρόσκλησης." });
            }
        }

        /// <summary>
        /// Create new invitation template
        /// </summary>
        [HttpPost("templates")]
        public async Task<ActionResult<InvitationTemplate>> CreateTemplate([FromBody] CreateInvitationTemplateRequest request)
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
                    LogoUrl = request.LogoUrl,
                    LogoPosition = request.LogoPosition ?? "center",
                    BodyFontFamily = request.BodyFontFamily ?? "Arial, sans-serif",
                    BodyFontSize = request.BodyFontSize ?? 14,
                    HeaderFontFamily = request.HeaderFontFamily ?? "Arial, sans-serif",
                    HeaderFontSize = request.HeaderFontSize ?? 18,
                    AvailableVariables = request.AvailableVariables != null 
                        ? JsonSerializer.Serialize(request.AvailableVariables) 
                        : null,
                    CreatedBy = request.CreatedBy
                };

                _context.InvitationTemplates.Add(template);
                await _context.SaveChangesAsync();

                // Return template with related data
                await _context.Entry(template)
                    .Reference(t => t.Questionnaire)
                    .LoadAsync();
                await _context.Entry(template)
                    .Reference(t => t.Creator)
                    .LoadAsync();

                return CreatedAtAction(nameof(GetTemplate), new { id = template.Id }, template);
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
        public async Task<IActionResult> UpdateTemplate(Guid id, [FromBody] UpdateInvitationTemplateRequest request)
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
                template.LogoUrl = request.LogoUrl;
                template.LogoPosition = request.LogoPosition ?? template.LogoPosition;
                template.BodyFontFamily = request.BodyFontFamily ?? template.BodyFontFamily;
                template.BodyFontSize = request.BodyFontSize ?? template.BodyFontSize;
                template.HeaderFontFamily = request.HeaderFontFamily ?? template.HeaderFontFamily;
                template.HeaderFontSize = request.HeaderFontSize ?? template.HeaderFontSize;
                template.AvailableVariables = request.AvailableVariables != null 
                    ? JsonSerializer.Serialize(request.AvailableVariables) 
                    : template.AvailableVariables;
                template.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
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

                // Check if template is being used in any batches
                var hasActiveBatches = await _context.InvitationBatches
                    .AnyAsync(b => b.TemplateId == id && b.Status != BatchStatus.Draft);

                if (hasActiveBatches)
                {
                    return BadRequest(new { message = "Δεν είναι δυνατή η διαγραφή προτύπου που χρησιμοποιείται σε ενεργές παρτίδες." });
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
        public async Task<ActionResult<IEnumerable<InvitationBatch>>> GetBatches([FromQuery] Guid? questionnaireId = null)
        {
            try
            {
                var query = _context.InvitationBatches
                    .Include(b => b.Template)
                    .Include(b => b.Questionnaire)
                    .Include(b => b.Creator)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(b => b.QuestionnaireId == questionnaireId.Value);
                }

                var batches = await query
                    .OrderByDescending(b => b.CreatedAt)
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
                    .Include(b => b.Template)
                    .Include(b => b.Questionnaire)
                    .Include(b => b.Creator)
                    .Include(b => b.Invitations)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (batch == null)
                {
                    return NotFound(new { message = "Η παρτίδα πρόσκλησης δεν βρέθηκε." });
                }

                // Calculate detailed statistics
                var invitations = batch.Invitations.ToList();
                var details = new InvitationBatchDetails
                {
                    Batch = batch,
                    Statistics = new BatchStatistics
                    {
                        TotalInvitations = invitations.Count,
                        DeliveredInvitations = invitations.Count(i => i.Status >= InvitationStatus.Delivered),
                        FailedInvitations = invitations.Count(i => i.Status == InvitationStatus.Failed),
                        OpenedInvitations = invitations.Count(i => i.Status >= InvitationStatus.Opened),
                        ClickedInvitations = invitations.Count(i => i.Status >= InvitationStatus.Clicked),
                        StartedResponses = invitations.Count(i => i.Status >= InvitationStatus.Started),
                        CompletedResponses = invitations.Count(i => i.Status >= InvitationStatus.Completed),
                        ParticipationRate = invitations.Count > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Started) / invitations.Count * 100 
                            : 0,
                        CompletionRate = invitations.Count(i => i.Status >= InvitationStatus.Started) > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Completed) / invitations.Count(i => i.Status >= InvitationStatus.Started) * 100 
                            : 0,
                        DeliveryRate = invitations.Count > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Delivered) / invitations.Count * 100 
                            : 0
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
        public async Task<ActionResult<InvitationBatch>> CreateBatch([FromBody] CreateInvitationBatchRequest request)
        {
            try
            {
                // Validate template and questionnaire exist
                var template = await _context.InvitationTemplates.FindAsync(request.TemplateId);
                if (template == null)
                {
                    return BadRequest(new { message = "Το πρότυπο πρόσκλησης δεν βρέθηκε." });
                }

                var questionnaire = await _context.Questionnaires.FindAsync(request.QuestionnaireId);
                if (questionnaire == null)
                {
                    return BadRequest(new { message = "Το ερωτηματολόγιο δεν βρέθηκε." });
                }

                var batch = new InvitationBatch
                {
                    Name = request.Name,
                    TemplateId = request.TemplateId,
                    QuestionnaireId = request.QuestionnaireId,
                    ScheduledSendTime = request.ScheduledSendTime,
                    ImmediateSend = request.ImmediateSend,
                    Recipients = JsonSerializer.Serialize(request.Recipients ?? new List<string>()),
                    CreatedBy = request.CreatedBy
                };

                _context.InvitationBatches.Add(batch);
                await _context.SaveChangesAsync();

                // Create individual invitations
                if (request.Recipients != null && request.Recipients.Any())
                {
                    var invitations = request.Recipients.Select(email => new Invitation
                    {
                        BatchId = batch.Id,
                        Name = $"Πρόσκληση για {email}",
                        SampleId = request.SampleId, // This should come from request
                        QuestionnaireId = request.QuestionnaireId,
                        RecipientEmail = email,
                        Token = Invitation.GenerateToken(),
                        Subject = template.Subject,
                        HtmlContent = template.HtmlContent,
                        PlainTextContent = template.PlainTextContent,
                        LogoUrl = template.LogoUrl,
                        LogoAlignment = template.LogoPosition,
                        CreatedBy = request.CreatedBy
                    }).ToList();

                    _context.Invitations.AddRange(invitations);
                    batch.TotalInvitations = invitations.Count;
                    await _context.SaveChangesAsync();
                }

                // Load related data
                await _context.Entry(batch)
                    .Reference(b => b.Template)
                    .LoadAsync();
                await _context.Entry(batch)
                    .Reference(b => b.Questionnaire)
                    .LoadAsync();
                await _context.Entry(batch)
                    .Reference(b => b.Creator)
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
                    .Include(b => b.Invitations)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (batch == null)
                {
                    return NotFound(new { message = "Η παρτίδα πρόσκλησης δεν βρέθηκε." });
                }

                if (batch.Status != BatchStatus.Draft && batch.Status != BatchStatus.Scheduled)
                {
                    return BadRequest(new { message = "Η παρτίδα έχει ήδη σταλεί ή δεν είναι έτοιμη για αποστολή." });
                }

                // Update batch status
                batch.Status = BatchStatus.Sending;
                batch.SentAt = DateTime.UtcNow;

                // Update individual invitations
                foreach (var invitation in batch.Invitations)
                {
                    invitation.UpdateStatus(InvitationStatus.Sent);
                    // Here you would integrate with your email service
                    // For now, we'll simulate successful sending
                    invitation.UpdateStatus(InvitationStatus.Delivered);
                }

                // Update batch statistics
                batch.Status = BatchStatus.Sent;
                batch.DeliveredInvitations = batch.Invitations.Count;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Η παρτίδα προσκλήσεων στάλθηκε επιτυχώς." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending invitation batch {BatchId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την αποστολή της παρτίδας προσκλήσεων." });
            }
        }

        /// <summary>
        /// Get batch statistics for analytics
        /// </summary>
        [HttpGet("batches/{id}/analytics")]
        public async Task<ActionResult<BatchAnalytics>> GetBatchAnalytics(Guid id)
        {
            try
            {
                var batch = await _context.InvitationBatches
                    .Include(b => b.Invitations)
                    .FirstOrDefaultAsync(b => b.Id == id);

                if (batch == null)
                {
                    return NotFound(new { message = "Η παρτίδα πρόσκλησης δεν βρέθηκε." });
                }

                var invitations = batch.Invitations.ToList();
                
                var analytics = new BatchAnalytics
                {
                    BatchId = id,
                    TotalInvitations = invitations.Count,
                    DeliveryStats = new DeliveryStatistics
                    {
                        Delivered = invitations.Count(i => i.Status >= InvitationStatus.Delivered),
                        Failed = invitations.Count(i => i.Status == InvitationStatus.Failed),
                        Pending = invitations.Count(i => i.Status < InvitationStatus.Delivered),
                        DeliveryRate = invitations.Count > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Delivered) / invitations.Count * 100 
                            : 0
                    },
                    EngagementStats = new EngagementStatistics
                    {
                        Opened = invitations.Count(i => i.Status >= InvitationStatus.Opened),
                        Clicked = invitations.Count(i => i.Status >= InvitationStatus.Clicked),
                        OpenRate = invitations.Count(i => i.Status >= InvitationStatus.Delivered) > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Opened) / invitations.Count(i => i.Status >= InvitationStatus.Delivered) * 100 
                            : 0,
                        ClickRate = invitations.Count(i => i.Status >= InvitationStatus.Opened) > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Clicked) / invitations.Count(i => i.Status >= InvitationStatus.Opened) * 100 
                            : 0
                    },
                    ResponseStats = new ResponseStatistics
                    {
                        Started = invitations.Count(i => i.Status >= InvitationStatus.Started),
                        Completed = invitations.Count(i => i.Status >= InvitationStatus.Completed),
                        ParticipationRate = invitations.Count > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Started) / invitations.Count * 100 
                            : 0,
                        CompletionRate = invitations.Count(i => i.Status >= InvitationStatus.Started) > 0 
                            ? (decimal)invitations.Count(i => i.Status >= InvitationStatus.Completed) / invitations.Count(i => i.Status >= InvitationStatus.Started) * 100 
                            : 0
                    },
                    TimelineData = GenerateTimelineData(invitations)
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving batch analytics {BatchId}", id);
                return StatusCode(500, new { message = "Σφάλμα κατά την ανάκτηση των στατιστικών." });
            }
        }

        private List<TimelineDataPoint> GenerateTimelineData(List<Invitation> invitations)
        {
            var timeline = new List<TimelineDataPoint>();
            var dates = invitations
                .Where(i => i.SentAt.HasValue)
                .GroupBy(i => i.SentAt.Value.Date)
                .OrderBy(g => g.Key);

            foreach (var dateGroup in dates)
            {
                timeline.Add(new TimelineDataPoint
                {
                    Date = dateGroup.Key,
                    Sent = dateGroup.Count(),
                    Delivered = dateGroup.Count(i => i.Status >= InvitationStatus.Delivered),
                    Opened = dateGroup.Count(i => i.Status >= InvitationStatus.Opened),
                    Clicked = dateGroup.Count(i => i.Status >= InvitationStatus.Clicked),
                    Started = dateGroup.Count(i => i.Status >= InvitationStatus.Started),
                    Completed = dateGroup.Count(i => i.Status >= InvitationStatus.Completed)
                });
            }

            return timeline;
        }
    }

    // Request/Response DTOs
    public class CreateInvitationTemplateRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid QuestionnaireId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string HtmlContent { get; set; } = string.Empty;
        public string? PlainTextContent { get; set; }
        public string? LogoUrl { get; set; }
        public string? LogoPosition { get; set; }
        public string? BodyFontFamily { get; set; }
        public int? BodyFontSize { get; set; }
        public string? HeaderFontFamily { get; set; }
        public int? HeaderFontSize { get; set; }
        public List<string>? AvailableVariables { get; set; }
        public Guid CreatedBy { get; set; }
    }

    public class UpdateInvitationTemplateRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string HtmlContent { get; set; } = string.Empty;
        public string? PlainTextContent { get; set; }
        public string? LogoUrl { get; set; }
        public string? LogoPosition { get; set; }
        public string? BodyFontFamily { get; set; }
        public int? BodyFontSize { get; set; }
        public string? HeaderFontFamily { get; set; }
        public int? HeaderFontSize { get; set; }
        public List<string>? AvailableVariables { get; set; }
    }

    public class CreateInvitationBatchRequest
    {
        public string Name { get; set; } = string.Empty;
        public Guid TemplateId { get; set; }
        public Guid QuestionnaireId { get; set; }
        public Guid SampleId { get; set; }
        public DateTime? ScheduledSendTime { get; set; }
        public bool ImmediateSend { get; set; } = false;
        public List<string>? Recipients { get; set; }
        public Guid CreatedBy { get; set; }
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
        public int OpenedInvitations { get; set; }
        public int ClickedInvitations { get; set; }
        public int StartedResponses { get; set; }
        public int CompletedResponses { get; set; }
        public decimal ParticipationRate { get; set; }
        public decimal CompletionRate { get; set; }
        public decimal DeliveryRate { get; set; }
    }

    public class BatchAnalytics
    {
        public Guid BatchId { get; set; }
        public int TotalInvitations { get; set; }
        public DeliveryStatistics DeliveryStats { get; set; } = null!;
        public EngagementStatistics EngagementStats { get; set; } = null!;
        public ResponseStatistics ResponseStats { get; set; } = null!;
        public List<TimelineDataPoint> TimelineData { get; set; } = new();
    }

    public class DeliveryStatistics
    {
        public int Delivered { get; set; }
        public int Failed { get; set; }
        public int Pending { get; set; }
        public decimal DeliveryRate { get; set; }
    }

    public class EngagementStatistics
    {
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public decimal OpenRate { get; set; }
        public decimal ClickRate { get; set; }
    }

    public class ResponseStatistics
    {
        public int Started { get; set; }
        public int Completed { get; set; }
        public decimal ParticipationRate { get; set; }
        public decimal CompletionRate { get; set; }
    }

    public class TimelineDataPoint
    {
        public DateTime Date { get; set; }
        public int Sent { get; set; }
        public int Delivered { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int Started { get; set; }
        public int Completed { get; set; }
    }
}