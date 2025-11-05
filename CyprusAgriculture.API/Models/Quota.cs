using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    /// <summary>
    /// Represents a quota for survey participants based on various criteria
    /// </summary>
    public class Quota
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Reference to questionnaire
        [Required]
        public Guid QuestionnaireId { get; set; }

        // Quota criteria (JSON string containing combinations of variables)
        [Required]
        [Column(TypeName = "jsonb")]
        public string Criteria { get; set; } = "{}";

        // Target numbers
        [Required]
        [Range(1, int.MaxValue)]
        public int TargetCount { get; set; }

        // Calculated properties based on QuotaResponses
        [NotMapped]
        public int CompletedCount => QuotaResponses?.Count(r => r.Status == "completed") ?? 0;

        [NotMapped]
        public int InProgressCount => QuotaResponses?.Count(r => r.Status == "in_progress") ?? 0;

        [NotMapped]
        public int PendingCount => QuotaResponses?.Count(r => r.Status == "allocated") ?? 0;

        [NotMapped]
        public decimal CompletionPercentage => TargetCount > 0 ? 
            Math.Round((decimal)CompletedCount / TargetCount * 100, 2) : 0;

        [NotMapped]
        public int RemainingCount => Math.Max(0, TargetCount - CompletedCount);

        [NotMapped]
        public string Status => CompletedCount >= TargetCount ? "Completed" : 
                               (CompletedCount + InProgressCount) >= TargetCount ? "Near Completion" : 
                               IsActive ? "Active" : "Paused";

        // Configuration
        public bool IsActive { get; set; } = true;
        public bool AutoStop { get; set; } = true; // Stop collecting when target reached

        // Priority for quota allocation (higher number = higher priority)
        public int Priority { get; set; } = 0;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? UpdatedBy { get; set; }

        // Navigation properties
        public virtual Questionnaire? Questionnaire { get; set; }
        public virtual ICollection<QuotaResponse> QuotaResponses { get; set; } = new List<QuotaResponse>();
    }

    /// <summary>
    /// Links survey responses to specific quotas
    /// </summary>
    public class QuotaResponse
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid QuotaId { get; set; }

        [Required]
        [StringLength(100)]
        public string ParticipantId { get; set; } = string.Empty;

        // Response status within quota context
        [StringLength(50)]
        public string Status { get; set; } = "allocated"; // allocated, in_progress, completed, dropped_out

        // When the response was allocated to this quota
        public DateTime AllocationDate { get; set; } = DateTime.UtcNow;

        // When the response was started
        public DateTime? StartDate { get; set; }

        // When the response was completed
        public DateTime? CompletionDate { get; set; }

        // Reference to the actual response (optional)
        public Guid? ResponseId { get; set; }

        // Additional metadata
        [Column(TypeName = "jsonb")]
        public string? Metadata { get; set; }

        // Who allocated this participant
        [Required]
        [StringLength(100)]
        public string AllocatedBy { get; set; } = string.Empty;

        // How the allocation was made
        [StringLength(50)]
        public string AllocationMethod { get; set; } = "manual"; // manual, automatic

        // Navigation properties
        public virtual Quota? Quota { get; set; }
    }

    /// <summary>
    /// Tracks quota criteria variables and their possible values
    /// </summary>
    public class QuotaVariable
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string DisplayName { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Variable type (e.g., "FarmSize", "FarmType", "Location", "Age", etc.)
        [Required]
        [StringLength(50)]
        public string VariableType { get; set; } = string.Empty;

        // Data type (e.g., "Select", "MultiSelect", "Range", "Text")
        [Required]
        [StringLength(20)]
        public string DataType { get; set; } = "Select";

        // Possible values (JSON array)
        [Column(TypeName = "jsonb")]
        public string PossibleValues { get; set; } = "[]";

        // Configuration
        public bool IsActive { get; set; } = true;
        public int SortOrder { get; set; } = 0;

        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}