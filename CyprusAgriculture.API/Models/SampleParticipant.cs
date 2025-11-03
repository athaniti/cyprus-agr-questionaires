using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("sample_participants")]
    public class SampleParticipant
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("sample_id")]
        public Guid SampleId { get; set; }

        [Required]
        [Column("farm_id")]
        public string FarmId { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "active"; // active, invited, completed, excluded

        [Column("selection_priority")]
        public int SelectionPriority { get; set; } = 0; // Προτεραιότητα επιλογής

        [Column("inclusion_reason")]
        [MaxLength(500)]
        public string? InclusionReason { get; set; } // Λόγος συμπερίληψης

        [Column("additional_data", TypeName = "jsonb")]
        public string AdditionalData { get; set; } = "{}"; // Πρόσθετα δεδομένα σε JSON

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("SampleId")]
        public virtual Sample Sample { get; set; } = null!;

        [ForeignKey("FarmId")]
        public virtual Farm Farm { get; set; } = null!;

        public virtual ICollection<Invitation> Invitations { get; set; } = new List<Invitation>();
    }
}