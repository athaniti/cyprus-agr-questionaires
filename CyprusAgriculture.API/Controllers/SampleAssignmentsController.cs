using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Controllers;

[ApiController]
[Route("api/sample-assignments")]
public class SampleAssignmentsController : ControllerBase
{
    private readonly CyprusAgricultureDbContext _context;
    private readonly ILogger<SampleAssignmentsController> _logger;

    public SampleAssignmentsController(CyprusAgricultureDbContext context, ILogger<SampleAssignmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetSampleAssignments()
    {
        try
        {
            var samplesWithAssignments = await _context.Samples
                .Include(s => s.Questionnaire)
                .Where(s => s.Status == "active")
                .Select(s => new
                {
                    SampleId = s.Id,
                    SampleName = s.Name,
                    Description = s.Description,
                    TargetSize = s.TargetSize,
                    Questionnaire = s.Questionnaire != null ? new
                    {
                        s.Questionnaire.Id,
                        s.Questionnaire.Name,
                        s.Questionnaire.Category
                    } : null,
                    // Get actual assignments from database
                    AssignedUsers = _context.SampleAssignments
                        .Where(sa => sa.SampleId == s.Id)
                        .Join(_context.Users,
                            sa => sa.UserId,
                            u => u.Id,
                            (sa, u) => new
                            {
                                u.Id,
                                FullName = u.FirstName + " " + u.LastName,
                                u.Email,
                                u.Region,
                                u.Role,
                                IsAssigned = true,
                                AssignedAt = sa.AssignedAt,
                                Status = sa.Status,
                                Notes = sa.Notes
                            })
                        .ToList(),
                    AssignmentCount = _context.SampleAssignments.Count(sa => sa.SampleId == s.Id),
                    // Also include all available users for the assignment interface
                    AvailableUsers = _context.Users
                        .Where(u => u.IsActive)
                        .Select(u => new
                        {
                            u.Id,
                            FullName = u.FirstName + " " + u.LastName,
                            u.Email,
                            u.Region,
                            u.Role,
                            IsAssigned = _context.SampleAssignments
                                .Any(sa => sa.SampleId == s.Id && sa.UserId == u.Id)
                        })
                        .ToList()
                })
                .ToListAsync();

            return Ok(samplesWithAssignments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching sample assignments");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpPost("{sampleId}/assign")]
    public async Task<ActionResult<object>> AssignUsersToSample(Guid sampleId, [FromBody] AssignUsersRequest request)
    {
        try
        {
            var sample = await _context.Samples
                .Include(s => s.Questionnaire)
                .FirstOrDefaultAsync(s => s.Id == sampleId);

            if (sample == null)
            {
                return NotFound(new { success = false, message = "Sample not found" });
            }

            // Get the users to assign
            var users = await _context.Users
                .Where(u => request.UserIds.Contains(u.Id) && u.IsActive)
                .ToListAsync();

            if (users.Count == 0)
            {
                return BadRequest(new { success = false, message = "No valid users found for assignment" });
            }

            // Check for existing assignments and remove them (to allow reassignment)
            var existingAssignments = await _context.SampleAssignments
                .Where(sa => sa.SampleId == sampleId)
                .ToListAsync();

            if (existingAssignments.Any())
            {
                _context.SampleAssignments.RemoveRange(existingAssignments);
            }

            // Create new sample assignments
            var assignments = users.Select(user => new SampleAssignment
            {
                Id = Guid.NewGuid(),
                SampleId = sampleId,
                UserId = user.Id,
                AssignedBy = Guid.Parse("00000000-0000-0000-0000-000000000001"), // System user for now
                Notes = request.Notes,
                Status = "assigned",
                AssignedAt = DateTime.UtcNow,
                Region = user.Region
            }).ToList();

            _context.SampleAssignments.AddRange(assignments);
            await _context.SaveChangesAsync();

            // Return the assignment details
            var assignedUsers = users.Select(u => new
            {
                u.Id,
                FullName = u.FirstName + " " + u.LastName,
                u.Email,
                u.Region,
                u.Role
            }).ToList();

            return Ok(new
            {
                success = true,
                message = $"Sample '{sample.Name}' assigned to {users.Count} users",
                sample = new
                {
                    sample.Id,
                    sample.Name,
                    sample.Description,
                    Questionnaire = sample.Questionnaire != null ? new
                    {
                        sample.Questionnaire.Id,
                        sample.Questionnaire.Name,
                        sample.Questionnaire.Category
                    } : null
                },
                assignedUsers = assignedUsers,
                assignmentCount = assignments.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error assigning users to sample");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("users")]
    public async Task<ActionResult<object>> GetAvailableUsers()
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.IsActive)
                .Select(u => new
                {
                    u.Id,
                    FullName = u.FirstName + " " + u.LastName,
                    u.Email,
                    u.Region,
                    u.Role
                })
                .OrderBy(u => u.Region)
                .ThenBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    [HttpGet("users/by-region/{region}")]
    public async Task<ActionResult<object>> GetUsersByRegion(string region)
    {
        try
        {
            var users = await _context.Users
                .Where(u => u.IsActive && u.Region == region)
                .Select(u => new
                {
                    u.Id,
                    FullName = u.FirstName + " " + u.LastName,
                    u.Email,
                    u.Region,
                    u.Role
                })
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users by region");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }
}

public class AssignUsersRequest
{
    public List<Guid> UserIds { get; set; } = new();
    public string? Notes { get; set; }
}