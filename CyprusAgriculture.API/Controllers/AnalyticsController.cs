using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(CyprusAgricultureDbContext context, ILogger<AnalyticsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Analytics/questionnaire/{questionnaireId}/summary
        [HttpGet("questionnaire/{questionnaireId}/summary")]
        public async Task<ActionResult<object>> GetQuestionnaireSummary(Guid questionnaireId)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                var summary = await _context.FormResponses
                    .Where(fr => fr.QuestionnaireId == questionnaireId)
                    .GroupBy(fr => 1)
                    .Select(g => new
                    {
                        TotalResponses = g.Count(),
                        CompletedResponses = g.Count(fr => fr.Status == "submitted"),
                        DraftResponses = g.Count(fr => fr.Status == "draft"),
                        InProgressResponses = g.Count(fr => fr.Status == "in_progress"),
                        AverageCompletion = (decimal)g.Average(fr => (double)fr.CompletionPercentage),
                        LastResponseDate = g.Max(fr => fr.UpdatedAt ?? fr.CreatedAt)
                    })
                    .FirstOrDefaultAsync();

                if (summary == null)
                {
                    return Ok(new
                    {
                        QuestionnaireId = questionnaireId,
                        QuestionnaireName = questionnaire.Name,
                        Summary = new
                        {
                            TotalResponses = 0,
                            CompletedResponses = 0,
                            DraftResponses = 0,
                            InProgressResponses = 0,
                            AverageCompletion = 0.0m,
                            LastResponseDate = (DateTime?)null
                        }
                    });
                }

                return Ok(new
                {
                    QuestionnaireId = questionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    Summary = summary
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting questionnaire summary for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/Analytics/questionnaire/{questionnaireId}/success-rates
        [HttpGet("questionnaire/{questionnaireId}/success-rates")]
        public async Task<ActionResult<object>> GetSuccessRates(Guid questionnaireId, 
            [FromQuery] string groupBy = "province")
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                var baseQuery = from fr in _context.FormResponses
                               join f in _context.Farms on fr.FarmId equals f.Id
                               where fr.QuestionnaireId == questionnaireId
                               select new { fr, f };

                object successRates;

                switch (groupBy.ToLower())
                {
                    case "province":
                        successRates = await baseQuery
                            .GroupBy(x => x.f.Province)
                            .Select(g => new
                            {
                                Province = g.Key,
                                TotalAssigned = g.Count(),
                                Completed = g.Count(x => x.fr.Status == "submitted"),
                                InProgress = g.Count(x => x.fr.Status == "in_progress"),
                                Draft = g.Count(x => x.fr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.fr.Status == "submitted") / g.Count() * 100 : 0,
                                AverageCompletion = g.Average(x => x.fr.CompletionPercentage)
                            })
                            .OrderByDescending(x => x.SuccessRate)
                            .ToListAsync();
                        break;

                    case "community":
                        successRates = await baseQuery
                            .GroupBy(x => new { x.f.Province, x.f.Community })
                            .Select(g => new
                            {
                                Province = g.Key.Province,
                                Community = g.Key.Community,
                                TotalAssigned = g.Count(),
                                Completed = g.Count(x => x.fr.Status == "submitted"),
                                InProgress = g.Count(x => x.fr.Status == "in_progress"),
                                Draft = g.Count(x => x.fr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.fr.Status == "submitted") / g.Count() * 100 : 0,
                                AverageCompletion = g.Average(x => x.fr.CompletionPercentage)
                            })
                            .OrderBy(x => x.Province)
                            .ThenByDescending(x => x.SuccessRate)
                            .ToListAsync();
                        break;

                    case "economic_size":
                        successRates = await baseQuery
                            .GroupBy(x => x.f.EconomicSize ?? "Unknown")
                            .Select(g => new
                            {
                                EconomicSize = g.Key,
                                TotalAssigned = g.Count(),
                                Completed = g.Count(x => x.fr.Status == "submitted"),
                                InProgress = g.Count(x => x.fr.Status == "in_progress"),
                                Draft = g.Count(x => x.fr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.fr.Status == "submitted") / g.Count() * 100 : 0,
                                AverageCompletion = g.Average(x => x.fr.CompletionPercentage)
                            })
                            .OrderByDescending(x => x.SuccessRate)
                            .ToListAsync();
                        break;

                    case "farm_type":
                        successRates = await baseQuery
                            .GroupBy(x => x.f.FarmType)
                            .Select(g => new
                            {
                                FarmType = g.Key,
                                TotalAssigned = g.Count(),
                                Completed = g.Count(x => x.fr.Status == "submitted"),
                                InProgress = g.Count(x => x.fr.Status == "in_progress"),
                                Draft = g.Count(x => x.fr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.fr.Status == "submitted") / g.Count() * 100 : 0,
                                AverageCompletion = g.Average(x => x.fr.CompletionPercentage)
                            })
                            .OrderByDescending(x => x.SuccessRate)
                            .ToListAsync();
                        break;

                    default:
                        return BadRequest("Invalid groupBy parameter. Valid values: province, community, economic_size, farm_type");
                }

                return Ok(new
                {
                    QuestionnaireId = questionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    GroupBy = groupBy,
                    SuccessRates = successRates
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting success rates for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/Analytics/questionnaire/{questionnaireId}/interviewer-performance
        [HttpGet("questionnaire/{questionnaireId}/interviewer-performance")]
        public async Task<ActionResult<object>> GetInterviewerPerformance(Guid questionnaireId)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                var performance = await (from fr in _context.FormResponses
                                       join u in _context.Users on fr.InterviewerId equals u.Id into userGroup
                                       from interviewer in userGroup.DefaultIfEmpty()
                                       where fr.QuestionnaireId == questionnaireId && fr.InterviewerId != null
                                       group new { fr, interviewer } by new { 
                                           InterviewerId = fr.InterviewerId,
                                           InterviewerName = interviewer != null ? $"{interviewer.FirstName} {interviewer.LastName}" : "Unknown"
                                       } into g
                                       select new
                                       {
                                           InterviewerId = g.Key.InterviewerId,
                                           InterviewerName = g.Key.InterviewerName,
                                           TotalAssigned = g.Count(),
                                           Completed = g.Count(x => x.fr.Status == "submitted"),
                                           InProgress = g.Count(x => x.fr.Status == "in_progress"),
                                           Draft = g.Count(x => x.fr.Status == "draft"),
                                           SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.fr.Status == "submitted") / g.Count() * 100 : 0,
                                           AverageCompletion = (double)g.Average(x => (decimal)x.fr.CompletionPercentage),
                                           AverageDaysToComplete = g.Where(x => x.fr.Status == "submitted" && x.fr.SubmittedAt != null)
                                                                    .Select(x => (x.fr.SubmittedAt!.Value - x.fr.CreatedAt).TotalDays)
                                                                    .DefaultIfEmpty(0)
                                                                    .Average()
                                       })
                                       .OrderByDescending(x => x.SuccessRate)
                                       .ToListAsync();

                return Ok(new
                {
                    QuestionnaireId = questionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    InterviewerPerformance = performance
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting interviewer performance for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/Analytics/questionnaire/{questionnaireId}/response-trends
        [HttpGet("questionnaire/{questionnaireId}/response-trends")]
        public async Task<ActionResult<object>> GetResponseTrends(Guid questionnaireId, 
            [FromQuery] int days = 30)
        {
            try
            {
                var questionnaire = await _context.Questionnaires.FindAsync(questionnaireId);
                if (questionnaire == null)
                {
                    return NotFound($"Questionnaire {questionnaireId} not found");
                }

                var startDate = DateTime.UtcNow.AddDays(-days);

                var trends = await _context.FormResponses
                    .Where(fr => fr.QuestionnaireId == questionnaireId && 
                                (fr.UpdatedAt ?? fr.CreatedAt) >= startDate)
                    .GroupBy(fr => fr.CreatedAt.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        TotalResponses = g.Count(),
                        NewResponses = g.Count(fr => fr.CreatedAt.Date == g.Key),
                        CompletedResponses = g.Count(fr => fr.Status == "submitted"),
                        UpdatedResponses = g.Count(fr => fr.UpdatedAt != null && fr.UpdatedAt.Value.Date == g.Key)
                    })
                    .OrderBy(x => x.Date)
                    .ToListAsync();

                return Ok(new
                {
                    QuestionnaireId = questionnaireId,
                    QuestionnaireName = questionnaire.Name,
                    PeriodDays = days,
                    Trends = trends
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting response trends for {QuestionnaireId}", questionnaireId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/Analytics/dashboard-overview
        [HttpGet("dashboard-overview")]
        public async Task<ActionResult<object>> GetDashboardOverview()
        {
            try
            {
                var totalQuestionnaires = await _context.Questionnaires.CountAsync();
                var totalFarms = await _context.Farms.CountAsync();
                var totalUsers = await _context.Users.CountAsync();
                
                var activeResponses = await _context.FormResponses
                    .GroupBy(fr => fr.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                var recentActivity = await _context.FormResponses
                    .Where(fr => (fr.UpdatedAt ?? fr.CreatedAt) >= DateTime.UtcNow.AddDays(-7))
                    .Include(fr => fr.Questionnaire)
                    .Include(fr => fr.Farm)
                    .Include(fr => fr.Interviewer)
                    .OrderByDescending(fr => fr.UpdatedAt ?? fr.CreatedAt)
                    .Take(10)
                    .Select(fr => new
                    {
                        fr.Id,
                        QuestionnaireName = fr.Questionnaire!.Name,
                        FarmCode = fr.Farm!.FarmCode,
                        FarmOwner = fr.Farm.OwnerName,
                        Province = fr.Farm.Province,
                        Status = fr.Status,
                        InterviewerName = fr.Interviewer != null ? $"{fr.Interviewer.FirstName} {fr.Interviewer.LastName}" : null,
                        LastUpdated = fr.UpdatedAt ?? fr.CreatedAt
                    })
                    .ToListAsync();

                return Ok(new
                {
                    Overview = new
                    {
                        TotalQuestionnaires = totalQuestionnaires,
                        TotalFarms = totalFarms,
                        TotalUsers = totalUsers
                    },
                    ResponseStats = activeResponses,
                    RecentActivity = recentActivity
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard overview");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}