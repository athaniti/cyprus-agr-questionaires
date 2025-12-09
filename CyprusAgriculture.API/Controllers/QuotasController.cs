using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using CyprusAgriculture.API.Models.DTOs;
using System.Text.Json;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotasController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<QuotasController> _logger;

        public QuotasController(CyprusAgricultureDbContext context, ILogger<QuotasController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/quotas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetQuotas()
        {
            try
            {
                var query = _context.Quotas.Include(q=>q.Questionnaire).ThenInclude(q=>q.Responses)
                    .AsQueryable();

                var quotas = await query
                    .OrderBy(q => q.Id)
                    .ToListAsync();

                var quotaDtos = quotas.Select(quota => new 
                {
                    quota.Id,
                    quota.Name,
                    quota.Description,
                    quota.QuestionnaireId,
                    QuestionnaireName = quota.Questionnaire.Name,
                    SerializedCriteria = quota.Criteria,
                    quota.TargetCount,
                    TotalCompleted = quota.Questionnaire.Responses.Where(r=>r.Status=="completed").Count(),
                    TotalResponses = quota.Questionnaire.Responses.Count()
                }).ToList();

                return Ok(quotaDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quotas");
                return StatusCode(500, "Internal server error");
            }
        }

        

        // POST: api/quotas
        [HttpPost]
        public async Task<ActionResult<object>> CreateQuota(CreateOrUpdateQuotaRequest request)
        {
            try
            {
                // Validate questionnaire exists
                var questionnaire = await _context.Questionnaires.FindAsync(request.QuestionnaireId);
                if (questionnaire == null)
                {
                    return BadRequest("Questionnaire not found");
                }

                // Create quota
                var quota = new Quota
                {
                    Name = request.Name,
                    Description = request.Description,
                    QuestionnaireId = request.QuestionnaireId,
                    Criteria = request.SerializedCriteria,
                    TargetCount = request.TargetCount
                };

                _context.Quotas.Add(quota);
                await _context.SaveChangesAsync();
                await _context.Entry(quota)
                    .Reference(b => b.Questionnaire)
                    .LoadAsync();
                var quotaDto = new 
                {
                    Id = quota.Id,
                    Name = quota.Name,
                    Description = quota.Description,
                    QuestionnaireId = quota.QuestionnaireId,
                    QuestionnaireName = quota.Questionnaire.Name,
                    SerializedCriteria = quota.Criteria,
                    TargetCount = quota.TargetCount
                };

                return Ok(quotaDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating quota");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/quotas/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateQuota(Guid id, CreateOrUpdateQuotaRequest request)
        {
            try
            {
                var quota = await _context.Quotas.FindAsync(id);
                if (quota == null)
                {
                    return NotFound();
                }

                quota.Name = request.Name;
                quota.Description = request.Description;
                quota.Criteria = request.SerializedCriteria;
                quota.TargetCount = request.TargetCount;
                quota.QuestionnaireId = request.QuestionnaireId;

                await _context.SaveChangesAsync();
                await _context.Entry(quota)
                    .Reference(b => b.Questionnaire)
                    .LoadAsync();
                
                var quotaDto = new 
                {
                    Id = quota.Id,
                    Name = quota.Name,
                    Description = quota.Description,
                    QuestionnaireId = quota.QuestionnaireId,
                    QuestionnaireName = quota.Questionnaire.Name,
                    SerializedCriteria = quota.Criteria,
                    TargetCount = quota.TargetCount
                };

                return Ok(quotaDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating quota {QuotaId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/quotas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuota(Guid id)
        {
            try
            {
                var quota = await _context.Quotas.FindAsync(id);
                if (quota == null)
                {
                    return NotFound();
                }

                _context.Quotas.Remove(quota);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting quota {QuotaId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class CreateOrUpdateQuotaRequest
    {
        public Guid QuestionnaireId {get;set;}
        public string Name {get;set;}
        public string? Description {get;set;}
        public int TargetCount {get;set;}
        public string SerializedCriteria {get;set;}
    }
}