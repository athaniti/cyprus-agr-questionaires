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
        public Guid UserId { get; set; }

        [Column(TypeName = "jsonb")]
        public string ResponseData { get; set; } = "{}"; // Form.io response data

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // draft, submitted, completed

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? SubmittedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Farm/Location information
        [MaxLength(200)]
        public string? FarmName { get; set; }

        [MaxLength(100)]
        public string? Region { get; set; }

        [MaxLength(100)]
        public string? Municipality { get; set; }

        [MaxLength(50)]
        public string? PostalCode { get; set; }

        // GPS coordinates
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire Questionnaire { get; set; } = null!;

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;
    }
}