using System.ComponentModel.DataAnnotations;

namespace CyprusAgriculture.API.Models
{
    public class Theme
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? Description { get; set; }

        public string LogoPosition { get; set; } = "left";
        public string? LogoImageBase64 {get;set;}

        public string? BodyFont {get;set;}

        public int? BodyFontSize {get;set;}

        public string? HeaderFont {get;set;}

        public int? HeaderFontSize {get;set;}
        public string? PrimaryColor {get;set;}
        public string? SecondaryColor {get;set;}
        public string? BackgroundColor {get;set;}
        public string? TextColor {get;set;}

        public bool IsDefault {get;set;}
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<Questionnaire> Questionnaires { get; set; } = new List<Questionnaire>();
    }
}