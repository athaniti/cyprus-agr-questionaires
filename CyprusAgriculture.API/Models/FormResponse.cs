using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("form_responses")]
    public class FormResponse
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

        [Column("form_schema_id")]
        public Guid? FormSchemaId { get; set; }

        [Required]
        [Column("response_data", TypeName = "jsonb")]
        public string ResponseData { get; set; } = string.Empty;

        [Column("submitted_at")]
        public DateTime? SubmittedAt { get; set; }

        [Column("status")]
        [StringLength(50)]
        public string Status { get; set; } = "draft"; // draft, submitted, reviewed, approved

        [Column("completion_percentage")]
        public decimal CompletionPercentage { get; set; } = 0;

        [Column("interviewer_id")]
        public Guid? InterviewerId { get; set; }

        [Column("interview_date")]
        public DateTime? InterviewDate { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("created_by")]
        public Guid CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("updated_by")]
        public Guid? UpdatedBy { get; set; }

        [Column("submission_status_id")]
        public Guid? SubmissionStatusId { get; set; }

        // Navigation properties
        [ForeignKey("FarmId")]
        public virtual Farm? Farm { get; set; }

        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire? Questionnaire { get; set; }

        [ForeignKey("FormSchemaId")]
        public virtual FormSchema? FormSchema { get; set; }

        [ForeignKey("InterviewerId")]
        public virtual User? Interviewer { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User? Creator { get; set; }

        [ForeignKey("UpdatedBy")]
        public virtual User? Updater { get; set; }

        [ForeignKey("SubmissionStatusId")]
        public virtual SubmissionStatus? SubmissionStatus { get; set; }
    }
}