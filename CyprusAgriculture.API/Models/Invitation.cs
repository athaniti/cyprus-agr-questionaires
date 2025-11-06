using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public enum InvitationStatus
    {
        Draft = 0,
        Scheduled = 1,
        Sent = 2,
        Delivered = 3,
        Failed = 4,
        Opened = 5,
        Clicked = 6,
        Started = 7,
        Completed = 8
    }

    public enum DeliveryStatus
    {
        Pending = 0,
        Delivered = 1,
        Failed = 2,
        Bounced = 3
    }

    public class Invitation
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        // Batch relationship
        public Guid? BatchId { get; set; }

        [ForeignKey(nameof(BatchId))]
        public virtual InvitationBatch? Batch { get; set; }

        [Required]
        public Guid SampleId { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        public Guid? ParticipantId { get; set; }

        // Recipient information
        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string RecipientEmail { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? RecipientName { get; set; }

        // Unique token for tracking
        [Required]
        [MaxLength(100)]
        public string Token { get; set; } = Guid.NewGuid().ToString("N")[..16];

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

        // Enhanced status tracking
        public InvitationStatus Status { get; set; } = InvitationStatus.Draft;

        public DeliveryStatus DeliveryStatus { get; set; } = DeliveryStatus.Pending;

        public DateTime? SentAt { get; set; }

        public DateTime? DeliveredAt { get; set; }

        public DateTime? OpenedAt { get; set; }

        public DateTime? ClickedAt { get; set; }

        [MaxLength(1000)]
        public string? DeliveryError { get; set; }

        // Participation tracking
        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Personalized variables (JSON object)
        public string? PersonalizationData { get; set; }

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

        // Helper methods
        public static string GenerateToken()
        {
            return Guid.NewGuid().ToString("N")[..16]; // 16 character token
        }

        public void UpdateStatus(InvitationStatus newStatus)
        {
            Status = newStatus;
            UpdatedAt = DateTime.UtcNow;

            switch (newStatus)
            {
                case InvitationStatus.Sent:
                    SentAt = DateTime.UtcNow;
                    break;
                case InvitationStatus.Delivered:
                    DeliveredAt = DateTime.UtcNow;
                    DeliveryStatus = DeliveryStatus.Delivered;
                    break;
                case InvitationStatus.Opened:
                    OpenedAt = DateTime.UtcNow;
                    break;
                case InvitationStatus.Clicked:
                    ClickedAt = DateTime.UtcNow;
                    break;
                case InvitationStatus.Started:
                    StartedAt = DateTime.UtcNow;
                    break;
                case InvitationStatus.Completed:
                    CompletedAt = DateTime.UtcNow;
                    break;
            }
        }
    }
}