using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("sample_groups")]
    public class SampleGroup
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("sample_id")]
        public Guid SampleId { get; set; }

        [Required]
        [Column("name")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Column("description")]
        [MaxLength(1000)]
        public string? Description { get; set; }

        [Column("farm_ids", TypeName = "jsonb")]
        public string? FarmIds {get;set;} = "{}"; // JSON string me farm ids

        [Column("criteria", TypeName = "jsonb")]
        public string? Criteria { get; set; } = "{}"; // JSON string με κριτήρια (περιοχή, είδος, μέγεθος)

        [Column("interviewer_id")]
        public Guid? InterviewerId { get; set; }

        [Required]
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Required]
        [Column("created_by")]
        public Guid CreatedBy { get; set; }


        // Navigation properties
        [ForeignKey("SampleId")]
        public virtual Sample Sample { get; set; }

        [ForeignKey("InterviewerId")]
        public virtual User? Interviewer { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User? CreatedByUser { get; set; }

    }
}