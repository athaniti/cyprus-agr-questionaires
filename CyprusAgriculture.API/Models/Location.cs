using System.ComponentModel.DataAnnotations;

namespace CyprusAgriculture.API.Models
{
    public class Location
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = string.Empty; // region, municipality, community, location

        [MaxLength(100)]
        public string? ParentName { get; set; }

        public Guid? ParentId { get; set; }

        [MaxLength(100)]
        public string? Municipality { get; set; }

        [MaxLength(20)]
        public string LocationLevel { get; set; } = "location"; // province, municipality, community, location

        [MaxLength(10)]
        public string? Code { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Location? Parent { get; set; }
        public virtual ICollection<Location> Children { get; set; } = new List<Location>();
    }
}