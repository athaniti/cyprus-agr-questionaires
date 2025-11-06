using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class InvitationTemplate
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public Guid QuestionnaireId { get; set; }

        [ForeignKey(nameof(QuestionnaireId))]
        public virtual Questionnaire? Questionnaire { get; set; }

        // Email template content
        [Required]
        [StringLength(300)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string HtmlContent { get; set; } = string.Empty;

        public string? PlainTextContent { get; set; }

        // Logo settings
        public string? LogoUrl { get; set; }
        
        [StringLength(20)]
        public string LogoPosition { get; set; } = "center"; // left, center, right

        // Font settings
        [StringLength(100)]
        public string BodyFontFamily { get; set; } = "Arial, sans-serif";

        public int BodyFontSize { get; set; } = 14;

        [StringLength(100)]
        public string HeaderFontFamily { get; set; } = "Arial, sans-serif";

        public int HeaderFontSize { get; set; } = 18;

        // Template variables that can be used
        public string? AvailableVariables { get; set; } // JSON array of variable names

        [Required]
        public Guid CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public virtual User? Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<InvitationBatch> InvitationBatches { get; set; } = new List<InvitationBatch>();
    }
}