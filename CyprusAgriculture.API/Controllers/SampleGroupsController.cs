using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Data;
using CyprusAgriculture.API.Models;
using System.Text.Json;

namespace CyprusAgriculture.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SampleGroupsController : ControllerBase
    {
        private readonly CyprusAgricultureDbContext _context;
        private readonly ILogger<SampleGroupsController> _logger;

        public SampleGroupsController(CyprusAgricultureDbContext context, ILogger<SampleGroupsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/SampleGroups/by-sample/{sampleId}
        [HttpGet("by-sample/{sampleId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetSampleGroups(Guid sampleId)
        {
            try
            {
                var groups = await _context.SampleGroups
                    .Where(sg => sg.SampleId == sampleId && sg.IsActive)
                    .Include(sg => sg.Interviewer)
                    .Include(sg => sg.SampleGroupFarms)
                        .ThenInclude(sgf => sgf.Farm)
                    .Select(sg => new
                    {
                        sg.Id,
                        sg.Name,
                        sg.Description,
                        sg.Criteria,
                        sg.CreatedAt,
                        Interviewer = sg.Interviewer != null ? new
                        {
                            sg.Interviewer.Id,
                            sg.Interviewer.FirstName,
                            sg.Interviewer.LastName,
                            sg.Interviewer.Email,
                            sg.Interviewer.Role
                        } : null,
                        FarmsCount = sg.SampleGroupFarms.Count,
                        Farms = sg.SampleGroupFarms.Select(sgf => new
                        {
                            sgf.Id,
                            sgf.FarmId,
                            sgf.Status,
                            sgf.Priority,
                            sgf.AssignedAt,
                            Farm = sgf.Farm != null ? new
                            {
                                sgf.Farm.Id,
                                sgf.Farm.FarmCode,
                                sgf.Farm.OwnerName,
                                sgf.Farm.Province,
                                sgf.Farm.Community,
                                sgf.Farm.FarmType,
                                sgf.Farm.TotalArea,
                                sgf.Farm.EconomicSize
                            } : null
                        }).ToList()
                    })
                    .ToListAsync();

                return Ok(groups);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting sample groups for sample {SampleId}", sampleId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // GET: api/SampleGroups/available-farms/{sampleId}
        [HttpGet("available-farms/{sampleId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableFarms(Guid sampleId)
        {
            try
            {
                // Get all farms in the sample that are not yet assigned to any group
                var assignedFarmIds = await _context.SampleGroupFarms
                    .Where(sgf => sgf.SampleGroup!.SampleId == sampleId)
                    .Select(sgf => sgf.FarmId)
                    .ToListAsync();

                var availableFarms = await _context.SampleParticipants
                    .Where(sp => sp.SampleId == sampleId && !assignedFarmIds.Contains(sp.FarmId))
                    .Include(sp => sp.Farm)
                    .Select(sp => new
                    {
                        sp.Farm!.Id,
                        sp.Farm.FarmCode,
                        sp.Farm.OwnerName,
                        sp.Farm.Province,
                        sp.Farm.Community,
                        sp.Farm.FarmType,
                        sp.Farm.TotalArea,
                        sp.Farm.EconomicSize,
                        sp.Farm.MainCrops,
                        sp.Farm.LivestockTypes,
                        sp.Farm.LegalStatus
                    })
                    .ToListAsync();

                return Ok(availableFarms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available farms for sample {SampleId}", sampleId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // POST: api/SampleGroups
        [HttpPost]
        public async Task<ActionResult<object>> CreateSampleGroup([FromBody] CreateSampleGroupRequest request)
        {
            try
            {
                var sampleGroup = new SampleGroup
                {
                    SampleId = request.SampleId,
                    Name = request.Name,
                    Description = request.Description,
                    Criteria = request.Criteria != null ? JsonSerializer.Serialize(request.Criteria) : null,
                    InterviewerId = request.InterviewerId,
                    CreatedBy = request.CreatedBy ?? Guid.Parse("00000000-0000-0000-0000-000000000001") // Default system user
                };

                _context.SampleGroups.Add(sampleGroup);
                await _context.SaveChangesAsync();

                // Return the created group with interviewer details
                var createdGroup = await _context.SampleGroups
                    .Where(sg => sg.Id == sampleGroup.Id)
                    .Include(sg => sg.Interviewer)
                    .Select(sg => new
                    {
                        sg.Id,
                        sg.Name,
                        sg.Description,
                        sg.Criteria,
                        sg.CreatedAt,
                        Interviewer = sg.Interviewer != null ? new
                        {
                            sg.Interviewer.Id,
                            sg.Interviewer.FirstName,
                            sg.Interviewer.LastName,
                            sg.Interviewer.Email,
                            sg.Interviewer.Role
                        } : null,
                        FarmsCount = 0
                    })
                    .FirstOrDefaultAsync();

                return Ok(createdGroup);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating sample group");
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // PUT: api/SampleGroups/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> UpdateSampleGroup(Guid id, [FromBody] UpdateSampleGroupRequest request)
        {
            try
            {
                var sampleGroup = await _context.SampleGroups.FindAsync(id);
                if (sampleGroup == null)
                {
                    return NotFound(new { message = "Sample group not found" });
                }

                sampleGroup.Name = request.Name ?? sampleGroup.Name;
                sampleGroup.Description = request.Description ?? sampleGroup.Description;
                sampleGroup.InterviewerId = request.InterviewerId ?? sampleGroup.InterviewerId;
                sampleGroup.UpdatedAt = DateTime.UtcNow;

                if (request.Criteria != null)
                {
                    sampleGroup.Criteria = JsonSerializer.Serialize(request.Criteria);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Sample group updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating sample group {Id}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // POST: api/SampleGroups/{id}/assign-farms
        [HttpPost("{id}/assign-farms")]
        public async Task<ActionResult<object>> AssignFarmsToGroup(Guid id, [FromBody] AssignFarmsRequest request)
        {
            try
            {
                var sampleGroup = await _context.SampleGroups.FindAsync(id);
                if (sampleGroup == null)
                {
                    return NotFound(new { message = "Sample group not found" });
                }

                // Remove farms that are already assigned to other groups in the same sample
                var alreadyAssignedFarms = await _context.SampleGroupFarms
                    .Where(sgf => sgf.SampleGroup!.SampleId == sampleGroup.SampleId && 
                                  request.FarmIds.Contains(sgf.FarmId))
                    .Select(sgf => sgf.FarmId)
                    .ToListAsync();

                var farmsToAssign = request.FarmIds.Except(alreadyAssignedFarms).ToList();

                var sampleGroupFarms = farmsToAssign.Select(farmId => new SampleGroupFarm
                {
                    SampleGroupId = id,
                    FarmId = farmId,
                    Status = request.Status ?? "assigned",
                    Priority = request.Priority ?? "medium",
                    Notes = request.Notes,
                    AssignedBy = request.AssignedBy ?? Guid.Parse("00000000-0000-0000-0000-000000000001")
                }).ToList();

                _context.SampleGroupFarms.AddRange(sampleGroupFarms);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = $"Successfully assigned {farmsToAssign.Count} farms to group",
                    assignedFarms = farmsToAssign.Count,
                    skippedFarms = alreadyAssignedFarms.Count
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning farms to group {Id}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // DELETE: api/SampleGroups/{groupId}/farms/{farmId}
        [HttpDelete("{groupId}/farms/{farmId}")]
        public async Task<ActionResult<object>> RemoveFarmFromGroup(Guid groupId, string farmId)
        {
            try
            {
                var sampleGroupFarm = await _context.SampleGroupFarms
                    .FirstOrDefaultAsync(sgf => sgf.SampleGroupId == groupId && sgf.FarmId == farmId);

                if (sampleGroupFarm == null)
                {
                    return NotFound(new { message = "Farm assignment not found" });
                }

                _context.SampleGroupFarms.Remove(sampleGroupFarm);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Farm removed from group successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing farm {FarmId} from group {GroupId}", farmId, groupId);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        // DELETE: api/SampleGroups/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<object>> DeleteSampleGroup(Guid id)
        {
            try
            {
                var sampleGroup = await _context.SampleGroups.FindAsync(id);
                if (sampleGroup == null)
                {
                    return NotFound(new { message = "Sample group not found" });
                }

                sampleGroup.IsActive = false;
                sampleGroup.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Sample group deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting sample group {Id}", id);
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }

    // Request DTOs
    public class CreateSampleGroupRequest
    {
        public Guid SampleId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public object? Criteria { get; set; }
        public Guid? InterviewerId { get; set; }
        public Guid? CreatedBy { get; set; }
    }

    public class UpdateSampleGroupRequest
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public object? Criteria { get; set; }
        public Guid? InterviewerId { get; set; }
    }

    public class AssignFarmsRequest
    {
        public List<string> FarmIds { get; set; } = new();
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Notes { get; set; }
        public Guid? AssignedBy { get; set; }
    }
}