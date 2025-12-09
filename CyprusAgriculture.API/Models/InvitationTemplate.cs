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
        public virtual Questionnaire Questionnaire { get; set; }

        // Email template content
        [Required]
        [StringLength(300)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        public string HtmlContent { get; set; } = string.Empty;

        public string? PlainTextContent { get; set; }

        // Logo settings
        public string? LogoImageBase64 { get; set; }
        
        [StringLength(20)]
        public string LogoAlignment { get; set; } = "center"; // left, center, right

        // Navigation properties
        public virtual ICollection<InvitationBatch> InvitationBatches { get; set; } = new List<InvitationBatch>();
    }
}