using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace CyprusAgriculture.API.Models
{
    public class Questionnaire
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty; // Livestock, Crops, Irrigation, Equipment, etc.

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // draft, active, completed, archived

        [Column(TypeName = "jsonb")]
        public string Schema { get; set; } = "{}"; // Form.io JSON Schema

        public int TargetResponses { get; set; } = 0;

        public int CurrentResponses { get; set; } = 0;

        [Required]
        public Guid CreatedBy { get; set; }

        public Guid? ThemeId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? PublishedAt { get; set; }

        public DateTime? ClosedAt { get; set; }

        // Navigation properties
        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; } = null!;

        [ForeignKey("ThemeId")]
        public virtual Theme? Theme { get; set; }

        public virtual ICollection<QuestionnaireResponse> Responses { get; set; } = new List<QuestionnaireResponse>();
        public virtual ICollection<QuestionnaireInvitation> Invitations { get; set; } = new List<QuestionnaireInvitation>();
        public virtual ICollection<QuestionnaireQuota> Quotas { get; set; } = new List<QuestionnaireQuota>();
    }
}