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




        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("SampleId")]
        public virtual Sample Sample { get; set; } = null!;

        [ForeignKey("FarmId")]
        public virtual Farm Farm { get; set; } = null!;
    }
}