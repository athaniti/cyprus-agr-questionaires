using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(CyprusAgricultureDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/dashboard/stats
        [HttpGet("stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            try
            {
                var stats = new
                {
                    ActiveQuestionnaires = await _context.Questionnaires.CountAsync(q => q.Status == "active"),
                    TotalResponses = await _context.QuestionnaireResponses.CountAsync(),
                    CompletedResponses = await _context.QuestionnaireResponses.CountAsync(r => r.Status == "completed"),
                    PendingInvitations = await _context.QuestionnaireInvitations.CountAsync(i => i.Status == "pending"),
                    TotalUsers = await _context.Users.CountAsync(u => u.IsActive),
                    CompletionRate = await CalculateOverallCompletionRate()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving dashboard stats");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/dashboard/regional-data
        [HttpGet("regional-data")]
        public async Task<ActionResult<IEnumerable<object>>> GetRegionalData()
        {
            try
            {
                var regionalData = await _context.QuestionnaireResponses
                    .Where(r => !string.IsNullOrEmpty(r.Region))
                    .GroupBy(r => r.Region)
                    .Select(g => new
                    {
                        Region = g.Key,
                        TotalResponses = g.Count(),
                        CompletedResponses = g.Count(r => r.Status == "completed"),
                        CompletionRate = g.Count() > 0 ? (double)g.Count(r => r.Status == "completed") / g.Count() * 100 : 0
                    })
                    .OrderBy(r => r.Region)
                    .ToListAsync();

                return Ok(regionalData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving regional data");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/dashboard/response-trends
        [HttpGet("response-trends")]
        public async Task<ActionResult<IEnumerable<object>>> GetResponseTrends([FromQuery] int days = 30)
        {
            try
            {
                var startDate = DateTime.UtcNow.AddDays(-days);

                var trends = await _context.QuestionnaireResponses
                    .Where(r => r.StartedAt >= startDate)
                    .GroupBy(r => r.StartedAt.Date)
                    .Select(g => new
                    {
                        Date = g.Key,
                        ResponseCount = g.Count(),
                        CompletedCount = g.Count(r => r.Status == "completed")
                    })
                    .OrderBy(t => t.Date)
                    .ToListAsync();

                return Ok(trends);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving response trends");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/dashboard/category-distribution
        [HttpGet("category-distribution")]
        public async Task<ActionResult<IEnumerable<object>>> GetCategoryDistribution()
        {
            try
            {
                var categoryData = await _context.Questionnaires
                    .Include(q => q.Responses)
                    .GroupBy(q => q.Category)
                    .Select(g => new
                    {
                        Category = g.Key,
                        QuestionnaireCount = g.Count(),
                        ResponseCount = g.SelectMany(q => q.Responses).Count(),
                        CompletedResponseCount = g.SelectMany(q => q.Responses).Count(r => r.Status == "completed")
                    })
                    .ToListAsync();

                return Ok(categoryData);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving category distribution");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/dashboard/recent-activity
        [HttpGet("recent-activity")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentActivity([FromQuery] int limit = 10)
        {
            try
            {
                var recentResponses = await _context.QuestionnaireResponses
                    .Include(r => r.Questionnaire)
                    .Include(r => r.User)
                    .OrderByDescending(r => r.StartedAt)
                    .Take(limit)
                    .Select(r => new
                    {
                        Type = "response",
                        Id = r.Id,
                        Title = $"Response to {r.Questionnaire.Name}",
                        UserName = r.User.FirstName + " " + r.User.LastName,
                        Status = r.Status,
                        Timestamp = r.StartedAt,
                        Region = r.Region
                    })
                    .ToListAsync();

                var recentQuestionnaires = await _context.Questionnaires
                    .Include(q => q.Creator)
                    .OrderByDescending(q => q.CreatedAt)
                    .Take(limit)
                    .Select(q => new
                    {
                        Type = "questionnaire",
                        Id = q.Id,
                        Title = $"Questionnaire: {q.Name}",
                        UserName = q.Creator.FirstName + " " + q.Creator.LastName,
                        Status = q.Status,
                        Timestamp = q.CreatedAt,
                        Region = (string?)null
                    })
                    .ToListAsync();

                var allActivity = recentResponses.Concat(recentQuestionnaires)
                    .OrderByDescending(a => a.Timestamp)
                    .Take(limit)
                    .ToList();

                return Ok(allActivity);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving recent activity");
                return StatusCode(500, "Internal server error");
            }
        }

        private async Task<double> CalculateOverallCompletionRate()
        {
            var totalTargetResponses = await _context.Questionnaires
                .Where(q => q.Status == "active")
                .SumAsync(q => q.TargetResponses);

            var totalCompletedResponses = await _context.QuestionnaireResponses
                .CountAsync(r => r.Status == "completed");

            return totalTargetResponses > 0 ? (double)totalCompletedResponses / totalTargetResponses * 100 : 0;
        }
    }
}