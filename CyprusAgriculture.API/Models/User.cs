using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = string.Empty; // admin, analyst, farmer

        [MaxLength(50)]
        public string? Region { get; set; }

        [MaxLength(100)]
        public string? Organization { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual ICollection<Questionnaire> CreatedQuestionnaires { get; set; } = new List<Questionnaire>();
        public virtual ICollection<QuestionnaireResponse> Responses { get; set; } = new List<QuestionnaireResponse>();
        public virtual ICollection<QuestionnaireInvitation> Invitations { get; set; } = new List<QuestionnaireInvitation>();
    }
}