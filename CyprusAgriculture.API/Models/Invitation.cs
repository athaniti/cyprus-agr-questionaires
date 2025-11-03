using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class Invitation
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public Guid SampleId { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        public Guid? ParticipantId { get; set; }

        // Email template properties
        [Required]
        [MaxLength(500)]
        public string Subject { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "text")]
        public string HtmlContent { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? PlainTextContent { get; set; }

        // Template styling
        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(20)]
        public string LogoAlignment { get; set; } = "center"; // left, center, right

        [Column(TypeName = "jsonb")]
        public string StyleSettings { get; set; } = "{}"; // JSON με font, sizes, colors

        // Scheduling
        public DateTime? ScheduledAt { get; set; }

        public bool SendImmediately { get; set; } = false;

        // Status tracking
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // draft, scheduled, sent, delivered, failed

        [MaxLength(20)]
        public string DeliveryStatus { get; set; } = "pending"; // pending, delivered, failed, bounced

        public DateTime? SentAt { get; set; }

        public DateTime? DeliveredAt { get; set; }

        public DateTime? OpenedAt { get; set; }

        public DateTime? ClickedAt { get; set; }

        [MaxLength(1000)]
        public string? DeliveryError { get; set; }

        // Participation tracking
        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        [MaxLength(20)]
        public string ParticipationStatus { get; set; } = "not_started"; // not_started, started, completed

        // Creation info
        [Required]
        public Guid CreatedBy { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("SampleId")]
        public virtual Sample Sample { get; set; } = null!;

        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire Questionnaire { get; set; } = null!;

        [ForeignKey("ParticipantId")]
        public virtual SampleParticipant? Participant { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User Creator { get; set; } = null!;
    }
}