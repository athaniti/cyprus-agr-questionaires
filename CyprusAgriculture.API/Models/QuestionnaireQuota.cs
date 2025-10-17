using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class QuestionnaireQuota
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Region { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? Municipality { get; set; }

        [Required]
        public int TargetCount { get; set; }

        public int CurrentCount { get; set; } = 0;

        [MaxLength(50)]
        public string? Category { get; set; } // Farm type, size category, etc.

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire Questionnaire { get; set; } = null!;
    }
}