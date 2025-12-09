using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    /// <summary>
    /// Represents a quota for survey participants based on various criteria
    /// </summary>
    public class Quota
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        // Reference to questionnaire
        [Required]
        public Guid QuestionnaireId { get; set; }

        // Quota criteria (JSON string containing combinations of variables)
        [Required]
        [Column(TypeName = "jsonb")]
        public string Criteria { get; set; } = "{}";

        // Target numbers
        [Required]
        [Range(1, int.MaxValue)]
        public int TargetCount { get; set; }


        [ForeignKey(nameof(QuestionnaireId))]
        public virtual Questionnaire? Questionnaire { get; set; }
    }

}