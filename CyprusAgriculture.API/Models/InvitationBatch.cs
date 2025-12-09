using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class InvitationBatch
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public Guid InvitationTemplateId { get; set; }

        [ForeignKey(nameof(InvitationTemplateId))]
        public virtual InvitationTemplate? InvitationTemplate { get; set; }

        [Column(TypeName = "jsonb")]
        public string RecipientFarms { get; set; } = "{}"; 

        // Scheduling
        public DateTime? ScheduledAt { get; set; }
        // Scheduling
        public DateTime? SentAt { get; set; }


    }
}