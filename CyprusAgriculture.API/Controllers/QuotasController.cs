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
        public async Task<ActionResult<IEnumerable<QuotaDto>>> GetQuotas([FromQuery] Guid? questionnaireId = null)
        {
            try
            {
                var query = _context.Quotas
                    .Include(q => q.QuotaResponses)
                    .AsQueryable();

                if (questionnaireId.HasValue)
                {
                    query = query.Where(q => q.QuestionnaireId == questionnaireId);
                }

                var quotas = await query
                    .OrderBy(q => q.Priority)
                    .ThenBy(q => q.CreatedAt)
                    .ToListAsync();

                var quotaDtos = quotas.Select(quota => new QuotaDto
                {
                    Id = quota.Id,
                    Name = quota.Name,
                    Description = quota.Description,
                    QuestionnaireId = quota.QuestionnaireId,
                    QuestionnaireName = "Unknown", // Will be populated later when we have questionnaires
                    Criteria = JsonSerializer.Deserialize<QuotaCriteriaDto>(quota.Criteria) ?? new QuotaCriteriaDto(),
                    TargetCount = quota.TargetCount,
                    CompletedCount = quota.CompletedCount,
                    InProgressCount = quota.InProgressCount,
                    PendingCount = quota.PendingCount,
                    RemainingCount = quota.RemainingCount,
                    CompletionPercentage = quota.CompletionPercentage,
                    Status = quota.Status,
                    IsActive = quota.IsActive,
                    AutoStop = quota.AutoStop,
                    Priority = quota.Priority,
                    CreatedAt = quota.CreatedAt,
                    UpdatedAt = quota.UpdatedAt,
                    CreatedBy = quota.CreatedBy,
                    UpdatedBy = quota.UpdatedBy
                }).ToList();

                return Ok(quotaDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quotas");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/quotas/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<QuotaDto>> GetQuota(Guid id)
        {
            try
            {
                var quota = await _context.Quotas
                    .Include(q => q.Questionnaire)
                    .FirstOrDefaultAsync(q => q.Id == id);

                if (quota == null)
                {
                    return NotFound();
                }

                var quotaDto = new QuotaDto
                {
                    Id = quota.Id,
                    Name = quota.Name,
                    Description = quota.Description,
                    QuestionnaireId = quota.QuestionnaireId,
                    QuestionnaireName = quota.Questionnaire?.Name ?? "Unknown",
                    Criteria = JsonSerializer.Deserialize<QuotaCriteriaDto>(quota.Criteria) ?? new QuotaCriteriaDto(),
                    TargetCount = quota.TargetCount,
                    CompletedCount = quota.CompletedCount,
                    InProgressCount = quota.InProgressCount,
                    PendingCount = quota.PendingCount,
                    RemainingCount = quota.RemainingCount,
                    CompletionPercentage = quota.CompletionPercentage,
                    Status = quota.Status,
                    IsActive = quota.IsActive,
                    AutoStop = quota.AutoStop,
                    Priority = quota.Priority,
                    CreatedAt = quota.CreatedAt,
                    UpdatedAt = quota.UpdatedAt,
                    CreatedBy = quota.CreatedBy,
                    UpdatedBy = quota.UpdatedBy
                };

                return Ok(quotaDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quota {QuotaId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/quotas
        [HttpPost]
        public async Task<ActionResult<QuotaDto>> CreateQuota(CreateQuotaRequest request)
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
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    Description = request.Description,
                    QuestionnaireId = request.QuestionnaireId,
                    Criteria = JsonSerializer.Serialize(request.Criteria),
                    TargetCount = request.TargetCount,
                    IsActive = request.IsActive,
                    AutoStop = request.AutoStop,
                    Priority = request.Priority,
                    CreatedBy = request.CreatedBy,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Quotas.Add(quota);
                await _context.SaveChangesAsync();

                var quotaDto = new QuotaDto
                {
                    Id = quota.Id,
                    Name = quota.Name,
                    Description = quota.Description,
                    QuestionnaireId = quota.QuestionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    Criteria = request.Criteria,
                    TargetCount = quota.TargetCount,
                    CompletedCount = quota.CompletedCount,
                    InProgressCount = quota.InProgressCount,
                    PendingCount = quota.PendingCount,
                    RemainingCount = quota.RemainingCount,
                    CompletionPercentage = quota.CompletionPercentage,
                    Status = quota.Status,
                    IsActive = quota.IsActive,
                    AutoStop = quota.AutoStop,
                    Priority = quota.Priority,
                    CreatedAt = quota.CreatedAt,
                    CreatedBy = quota.CreatedBy
                };

                return CreatedAtAction(nameof(GetQuota), new { id = quota.Id }, quotaDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating quota");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/quotas/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuota(Guid id, UpdateQuotaRequest request)
        {
            try
            {
                var quota = await _context.Quotas.FindAsync(id);
                if (quota == null)
                {
                    return NotFound();
                }

                // Update fields
                if (!string.IsNullOrEmpty(request.Name))
                    quota.Name = request.Name;
                
                if (request.Description != null)
                    quota.Description = request.Description;
                
                if (request.Criteria != null)
                    quota.Criteria = JsonSerializer.Serialize(request.Criteria);
                
                if (request.TargetCount.HasValue)
                    quota.TargetCount = request.TargetCount.Value;
                
                if (request.IsActive.HasValue)
                    quota.IsActive = request.IsActive.Value;
                
                if (request.AutoStop.HasValue)
                    quota.AutoStop = request.AutoStop.Value;
                
                if (request.Priority.HasValue)
                    quota.Priority = request.Priority.Value;

                quota.UpdatedAt = DateTime.UtcNow;
                quota.UpdatedBy = request.UpdatedBy;

                await _context.SaveChangesAsync();

                return NoContent();
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

        // GET: api/quotas/monitoring/{questionnaireId}
        [HttpGet("monitoring/{questionnaireId}")]
        public async Task<ActionResult<QuotaMonitoringDto>> GetQuotaMonitoring(Guid questionnaireId)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound();
                }

                var quotas = await _context.Quotas
                    .Where(q => q.QuestionnaireId == questionnaireId)
                    .Include(q => q.QuotaResponses)
                    .OrderBy(q => q.Priority)
                    .ThenBy(q => q.CreatedAt)
                    .ToListAsync();

                var quotaStatuses = quotas.Select(quota =>
                {
                    var today = DateTime.UtcNow.Date;
                    var weekAgo = today.AddDays(-7);

                    var todayCompletions = quota.QuotaResponses
                        .Count(qr => qr.Status == "completed" && qr.CompletionDate?.Date == today);

                    var weekCompletions = quota.QuotaResponses
                        .Count(qr => qr.Status == "completed" && qr.CompletionDate >= weekAgo);

                    var dailyRate = weekCompletions / 7.0m;
                    var estimatedCompletion = dailyRate > 0 
                        ? today.AddDays((double)(quota.RemainingCount / dailyRate))
                        : (DateTime?)null;

                    return new QuotaStatusDto
                    {
                        Id = quota.Id,
                        Name = quota.Name,
                        Criteria = JsonSerializer.Deserialize<QuotaCriteriaDto>(quota.Criteria) ?? new QuotaCriteriaDto(),
                        TargetCount = quota.TargetCount,
                        CompletedCount = quota.CompletedCount,
                        InProgressCount = quota.InProgressCount,
                        PendingCount = quota.PendingCount,
                        RemainingCount = quota.RemainingCount,
                        CompletionPercentage = quota.CompletionPercentage,
                        Status = quota.Status,
                        IsActive = quota.IsActive,
                        Priority = quota.Priority,
                        TodayCompletions = todayCompletions,
                        WeekCompletions = weekCompletions,
                        DailyRate = dailyRate,
                        EstimatedCompletion = estimatedCompletion
                    };
                }).ToList();

                var summary = new QuotaSummaryDto
                {
                    TotalQuotas = quotas.Count,
                    ActiveQuotas = quotas.Count(q => q.IsActive),
                    CompletedQuotas = quotas.Count(q => q.Status == "Completed"),
                    TotalTargetCount = quotas.Sum(q => q.TargetCount),
                    TotalCompletedCount = quotas.Sum(q => q.CompletedCount),
                    TotalInProgressCount = quotas.Sum(q => q.InProgressCount),
                    TotalPendingCount = quotas.Sum(q => q.PendingCount),
                    TotalRemainingCount = quotas.Sum(q => q.RemainingCount),
                    OverallCompletionPercentage = quotas.Sum(q => q.TargetCount) > 0 
                        ? Math.Round((decimal)quotas.Sum(q => q.CompletedCount) / quotas.Sum(q => q.TargetCount) * 100, 2) 
                        : 0,
                    TodayCompletions = quotaStatuses.Sum(qs => qs.TodayCompletions),
                    WeekCompletions = quotaStatuses.Sum(qs => qs.WeekCompletions),
                    AverageDailyRate = quotaStatuses.Average(qs => qs.DailyRate)
                };

                var monitoring = new QuotaMonitoringDto
                {
                    QuestionnaireId = questionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    Quotas = quotaStatuses,
                    Summary = summary,
                    LastUpdated = DateTime.UtcNow
                };

                return Ok(monitoring);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quota monitoring for questionnaire {QuestionnaireId}", questionnaireId);
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/quotas/variables
        [HttpGet("variables")]
        public async Task<ActionResult<IEnumerable<QuotaVariableDto>>> GetQuotaVariables()
        {
            try
            {
                var variables = await _context.QuotaVariables
                    .Where(v => v.IsActive)
                    .OrderBy(v => v.SortOrder)
                    .ThenBy(v => v.DisplayName)
                    .ToListAsync();

                var variableDtos = variables.Select(variable =>
                {
                    var possibleValues = string.IsNullOrEmpty(variable.PossibleValues) 
                        ? new List<QuotaVariableValueDto>()
                        : JsonSerializer.Deserialize<List<QuotaVariableValueDto>>(variable.PossibleValues) ?? new List<QuotaVariableValueDto>();

                    return new QuotaVariableDto
                    {
                        Id = variable.Id,
                        Name = variable.Name,
                        DisplayName = variable.DisplayName,
                        Description = variable.Description,
                        VariableType = variable.VariableType,
                        DataType = variable.DataType,
                        PossibleValues = possibleValues,
                        IsActive = variable.IsActive,
                        SortOrder = variable.SortOrder
                    };
                }).ToList();

                return Ok(variableDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving quota variables");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/quotas/variables
        [HttpPost("variables")]
        public async Task<ActionResult<QuotaVariableDto>> CreateQuotaVariable(CreateQuotaVariableRequest request)
        {
            try
            {
                var variable = new QuotaVariable
                {
                    Id = Guid.NewGuid(),
                    Name = request.Name,
                    DisplayName = request.DisplayName,
                    Description = request.Description,
                    VariableType = request.VariableType,
                    DataType = request.DataType,
                    PossibleValues = JsonSerializer.Serialize(request.PossibleValues),
                    IsActive = request.IsActive,
                    SortOrder = request.SortOrder,
                    CreatedAt = DateTime.UtcNow
                };

                _context.QuotaVariables.Add(variable);
                await _context.SaveChangesAsync();

                var variableDto = new QuotaVariableDto
                {
                    Id = variable.Id,
                    Name = variable.Name,
                    DisplayName = variable.DisplayName,
                    Description = variable.Description,
                    VariableType = variable.VariableType,
                    DataType = variable.DataType,
                    PossibleValues = request.PossibleValues,
                    IsActive = variable.IsActive,
                    SortOrder = variable.SortOrder
                };

                return CreatedAtAction(nameof(GetQuotaVariables), variableDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating quota variable");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}