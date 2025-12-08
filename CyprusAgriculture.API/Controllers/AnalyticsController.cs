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

                var summary = await _context.QuestionnaireResponses
                    .Where(fr => fr.QuestionnaireId == questionnaireId)
                    .GroupBy(fr => 1)
                    .Select(g => new
                    {
                        TotalResponses = g.Count(),
                        CompletedResponses = g.Count(fr => fr.Status == "completed"),
                        DraftResponses = g.Count(fr => fr.Status == "draft"),
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

                var baseQuery = from qr in _context.QuestionnaireResponses
                               join f in _context.Farms on qr.FarmId equals f.Id
                               where qr.QuestionnaireId == questionnaireId
                               select new { qr, f };

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
                                Completed = g.Count(x => x.qr.Status == "completed"),
                                Draft = g.Count(x => x.qr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.qr.Status == "completed") / g.Count() * 100 : 0
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
                                Completed = g.Count(x => x.qr.Status == "completed"),
                                Draft = g.Count(x => x.qr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.qr.Status == "completed") / g.Count() * 100 : 0
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
                                Completed = g.Count(x => x.qr.Status == "completed"),
                                Draft = g.Count(x => x.qr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.qr.Status == "completed") / g.Count() * 100 : 0
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
                                Completed = g.Count(x => x.qr.Status == "completed"),
                                Draft = g.Count(x => x.qr.Status == "draft"),
                                SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.qr.Status == "completed") / g.Count() * 100 : 0
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

                var responses = _context.QuestionnaireResponses.Include(qr=>qr.User).Where(qr => qr.QuestionnaireId == questionnaireId).ToList();
                var interviewerGroups = responses.GroupBy(qr => new { qr.UserId, InterviewerName = qr.User != null ? qr.User.FirstName + " " + qr.User.LastName : "Unknown" }).ToList();
                var performance = interviewerGroups.Select(g =>new
                                       {
                                           InterviewerId = g.Key.UserId,
                                           InterviewerName = g.Key.InterviewerName,
                                           TotalAssigned = g.Count(),
                                           Completed = g.Count(x => x.Status == "completed"),
                                           Draft = g.Count(x => x.Status == "draft"),
                                           SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.Status == "completed") / g.Count() * 100 : 0,
                                           AverageDaysToComplete = g.Where(x => x.Status == "completed" && x.UpdatedAt != null)
                                                                    .Select(x => (x.UpdatedAt!.Value - x.CreatedAt).TotalDays)
                                                                    .DefaultIfEmpty(0)
                                                                    .Average()
                                       })
                                       .OrderByDescending(x => x.SuccessRate)
                                       .ToList();

                // var performance = await (from qr in _context.QuestionnaireResponses
                //                        join u in _context.Users on qr.UserId equals u.Id into userGroup
                //                        from interviewer in userGroup.DefaultIfEmpty()
                //                        where qr.QuestionnaireId == questionnaireId
                //                        group new { qr, interviewer } by new { 
                //                            InterviewerId = qr.UserId,
                //                            InterviewerName = $"{interviewer.FirstName} {interviewer.LastName}"
                //                        } into g
                //                        select new
                //                        {
                //                            InterviewerId = g.Key.InterviewerId,
                //                            InterviewerName = g.Key.InterviewerName,
                //                            TotalAssigned = g.Count(),
                //                            Completed = g.Count(x => x.qr.Status == "submitted"),
                //                            InProgress = g.Count(x => x.qr.Status == "in_progress"),
                //                            Draft = g.Count(x => x.qr.Status == "draft"),
                //                            SuccessRate = g.Count() > 0 ? (double)g.Count(x => x.qr.Status == "submitted") / g.Count() * 100 : 0,
                //                            AverageCompletion = (double)g.Average(x => (decimal)x.qr.CompletionPercentage),
                //                            AverageDaysToComplete = g.Where(x => x.qr.Status == "submitted" && x.qr.SubmittedAt != null)
                //                                                     .Select(x => (x.qr.SubmittedAt!.Value - x.qr.CreatedAt).TotalDays)
                //                                                     .DefaultIfEmpty(0)
                //                                                     .Average()
                //                        })
                //                        .OrderByDescending(x => x.SuccessRate)
                //                        .ToListAsync();

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

                var trends = await _context.QuestionnaireResponses
                    .Where(qr => qr.QuestionnaireId == questionnaireId && 
                                (qr.UpdatedAt ?? qr.CreatedAt) >= startDate)
                    .GroupBy(qr => qr.CreatedAt.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        TotalResponses = g.Count(),
                        NewResponses = g.Count(fr => fr.CreatedAt.Date == g.Key),
                        CompletedResponses = g.Count(fr => fr.Status == "completed"),
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
                
                var activeResponses = await _context.QuestionnaireResponses
                    .GroupBy(qr => qr.Status)
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                var recentActivity = await _context.QuestionnaireResponses
                    .Where(qr => (qr.UpdatedAt ?? qr.CreatedAt) >= DateTime.UtcNow.AddDays(-7))
                    .Include(qr => qr.Questionnaire)
                    .Include(qr => qr.Farm)
                    .Include(qr => qr.User)
                    .OrderByDescending(qr => qr.UpdatedAt ?? qr.CreatedAt)
                    .Take(10)
                    .Select(qr => new
                    {
                        qr.Id,
                        QuestionnaireName = qr.Questionnaire!.Name,
                        FarmCode = qr.Farm!.FarmCode,
                        FarmOwner = qr.Farm.OwnerName,
                        Province = qr.Farm.Province,
                        Status = qr.Status,
                        InterviewerName = qr.User != null ? $"{qr.User.FirstName} {qr.User.LastName}" : null,
                        LastUpdated = qr.UpdatedAt ?? qr.CreatedAt
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