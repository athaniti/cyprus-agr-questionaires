using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class Sample
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int TargetSize { get; set; }

        public int CurrentSize { get; set; } = 0;

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "draft"; // draft, active, completed

        [Column(TypeName = "jsonb")]
        public string FilterCriteria { get; set; } = "{}"; // JSON με τα κριτήρια φιλτραρίσματος

        public Guid? QuestionnaireId { get; set; }

        public Guid CreatedBy { get; set; } = Guid.NewGuid();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire? Questionnaire { get; set; }

        public virtual ICollection<SampleParticipant> Participants { get; set; } = new List<SampleParticipant>();
        public virtual ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
    }
}