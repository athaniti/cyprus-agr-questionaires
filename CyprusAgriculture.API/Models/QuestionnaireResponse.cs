using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class QuestionnaireResponse
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        [Required]
        [Column("farm_id")]
        public string FarmId { get; set; } = string.Empty;

        [Required]
        public Guid UserId { get; set; }

        [Column(TypeName = "jsonb")]
        public string ResponseData { get; set; } = "{}"; // Form.io response data

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // draft, submitted, completed

        [Column("completion_percentage")]
        public decimal CompletionPercentage { get; set; } = 0;

        [Column("notes")]
        public string? Notes { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? SubmittedAt { get; set; }

        public DateTime? CompletedAt { get; set; }


        // GPS coordinates
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("created_by")]
        public Guid? CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("updated_by")]
        public Guid? UpdatedBy { get; set; }


        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire Questionnaire { get; set; } = null!;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("FarmId")]
        public virtual Farm? Farm { get; set; } = null!;


    }
}