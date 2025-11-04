using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("sample_group_farms")]
    public class SampleGroupFarm
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("sample_group_id")]
        public Guid SampleGroupId { get; set; }

        [Required]
        [Column("farm_id")]
        public string FarmId { get; set; } = string.Empty;

        [Required]
        [Column("assigned_at")]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("assigned_by")]
        public Guid AssignedBy { get; set; }

        [Column("status")]
        [MaxLength(50)]
        public string Status { get; set; } = "assigned"; // assigned, in_progress, completed, cancelled

        [Column("notes")]
        [MaxLength(1000)]
        public string? Notes { get; set; }

        [Column("priority")]
        [MaxLength(20)]
        public string Priority { get; set; } = "medium"; // high, medium, low

        // Navigation properties
        [ForeignKey("SampleGroupId")]
        public virtual SampleGroup? SampleGroup { get; set; }

        [ForeignKey("FarmId")]
        public virtual Farm? Farm { get; set; }

        [ForeignKey("AssignedBy")]
        public virtual User? AssignedByUser { get; set; }
    }
}