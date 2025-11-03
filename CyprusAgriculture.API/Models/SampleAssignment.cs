using System.ComponentModel.DataAnnotations;

namespace CyprusAgriculture.API.Models;

public class SampleAssignment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid SampleId { get; set; }
    public Sample? Sample { get; set; }

    [Required]
    public Guid UserId { get; set; }
    public User? User { get; set; }

    [Required]
    public Guid AssignedBy { get; set; }
    public User? AssignedByUser { get; set; }

    public string? Notes { get; set; }

    [Required]
    public string Status { get; set; } = "assigned"; // assigned, in_progress, completed, cancelled

    [Required]
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? DueDate { get; set; }

    public string? Region { get; set; } // Cache the user's region for easier querying
}