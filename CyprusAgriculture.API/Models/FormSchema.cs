using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("form_schemas")]
    public class FormSchema
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [Column("questionnaire_id")]
        public Guid QuestionnaireId { get; set; }

        [Required]
        [StringLength(255)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Column("schema_json", TypeName = "jsonb")]
        public string SchemaJson { get; set; } = string.Empty;

        [Column("version")]
        public int Version { get; set; } = 1;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("created_by")]
        public Guid CreatedBy { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        [Column("updated_by")]
        public Guid? UpdatedBy { get; set; }

        // Navigation properties
        [ForeignKey("QuestionnaireId")]
        public virtual Questionnaire? Questionnaire { get; set; }

        [ForeignKey("CreatedBy")]
        public virtual User? Creator { get; set; }

        [ForeignKey("UpdatedBy")]
        public virtual User? Updater { get; set; }

        public virtual ICollection<FormResponse> Responses { get; set; } = new List<FormResponse>();
    }
}