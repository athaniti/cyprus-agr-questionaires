using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public enum BatchStatus
    {
        Draft = 0,
        Scheduled = 1,
        Sending = 2,
        Sent = 3,
        Failed = 4,
        Cancelled = 5
    }

    public class InvitationBatch
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public Guid TemplateId { get; set; }

        [ForeignKey(nameof(TemplateId))]
        public virtual InvitationTemplate? Template { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        [ForeignKey(nameof(QuestionnaireId))]
        public virtual Questionnaire? Questionnaire { get; set; }

        // Scheduling
        public DateTime? ScheduledSendTime { get; set; }
        public bool ImmediateSend { get; set; } = false;

        // Status
        public BatchStatus Status { get; set; } = BatchStatus.Draft;

        // Statistics
        public int TotalInvitations { get; set; } = 0;
        public int DeliveredInvitations { get; set; } = 0;
        public int FailedInvitations { get; set; } = 0;
        public int OpenedInvitations { get; set; } = 0;
        public int ClickedInvitations { get; set; } = 0;
        public int StartedResponses { get; set; } = 0;
        public int CompletedResponses { get; set; } = 0;

        // Calculated properties
        [NotMapped]
        public decimal ParticipationRate => TotalInvitations > 0 ? 
            (decimal)StartedResponses / TotalInvitations * 100 : 0;

        [NotMapped]
        public decimal CompletionRate => StartedResponses > 0 ? 
            (decimal)CompletedResponses / StartedResponses * 100 : 0;

        [NotMapped]
        public decimal DeliveryRate => TotalInvitations > 0 ? 
            (decimal)DeliveredInvitations / TotalInvitations * 100 : 0;

        // Recipients (could be JSON array of email addresses or reference to contact list)
        public string Recipients { get; set; } = string.Empty; // JSON array

        [Required]
        public Guid CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public virtual User? Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SentAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
    }
}