using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("submission_status")]
    public class SubmissionStatus
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("farm_id")]
        public string FarmId { get; set; } = string.Empty;

        [Required]
        [Column("questionnaire_id")]
        public Guid QuestionnaireId { get; set; }

        [Column("sample_group_id")]
        public Guid? SampleGroupId { get; set; }

        [Required]
        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; } = "assigned"; // assigned, in_progress, completed, rejected

        [Column("assigned_interviewer_id")]
        public Guid? AssignedInterviewerId { get; set; }

        [Column("completion_percentage")]
        public decimal CompletionPercentage { get; set; } = 0;

        [Column("assigned_at")]
        public DateTime? AssignedAt { get; set; }

        [Column("started_at")]
        public DateTime? StartedAt { get; set; }

        [Column("completed_at")]
        public DateTime? CompletedAt { get; set; }

        [Column("deadline")]
        public DateTime? Deadline { get; set; }

        [Column("priority")]
        [StringLength(20)]
        public string Priority { get; set; } = "medium"; // low, medium, high, urgent

        [Column("attempts")]
        public int Attempts { get; set; } = 0;

        [Column("last_contact_date")]
        public DateTime? LastContactDate { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("FarmId")]
        public virtual Farm? Farm { get; set; }

        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire? Questionnaire { get; set; }

        [ForeignKey("SampleGroupId")]
        public virtual SampleGroup? SampleGroup { get; set; }

        [ForeignKey("AssignedInterviewerId")]
        public virtual User? AssignedInterviewer { get; set; }

        public virtual ICollection<FormResponse> FormResponses { get; set; } = new List<FormResponse>();
    }
}