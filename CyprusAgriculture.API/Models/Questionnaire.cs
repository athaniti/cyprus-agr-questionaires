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
        [MaxLength(20)]
        public string Status { get; set; } = "active"; // active, inactive

        [Column(TypeName = "jsonb")]
        public string Schema { get; set; } = "{}"; // Form.io JSON Schema

        [Required]
        public Guid CreatedBy { get; set; }

        public Guid? ThemeId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; } = null!;

        [ForeignKey("ThemeId")]
        public virtual Theme? Theme { get; set; }

        public virtual ICollection<QuestionnaireResponse> Responses { get; set; } = new List<QuestionnaireResponse>();
        public virtual ICollection<Sample> Samples { get; set; } = new List<Sample>();
    }
}