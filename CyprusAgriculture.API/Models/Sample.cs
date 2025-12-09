using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class Sample
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid QuestionnaireId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public int TargetSize { get; set; }

        [Column(TypeName = "jsonb")]
        public string FilterCriteria { get; set; } = "{}"; // JSON με τα κριτήρια φιλτραρίσματος

        

        public Guid CreatedBy { get; set; } = Guid.NewGuid();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire? Questionnaire { get; set; }

        public virtual ICollection<SampleGroup> SampleGroups { get; set; } = new List<SampleGroup>();
        public virtual ICollection<SampleParticipant> Participants { get; set; } = new List<SampleParticipant>();
    }
}