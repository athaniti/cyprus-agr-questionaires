using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CyprusAgriculture.API.Models
{
    [Table("farms")]
    public class Farm
    {
        [Key]
        [Column("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        [Column("farm_code")]
        [StringLength(50)]
        public string FarmCode { get; set; } = string.Empty;

        [Required]
        [Column("owner_name")]
        [StringLength(200)]
        public string OwnerName { get; set; } = string.Empty;

        [Column("contact_phone")]
        [StringLength(20)]
        public string? ContactPhone { get; set; }

        [Column("contact_email")]
        [StringLength(100)]
        public string? ContactEmail { get; set; }

        // Γεωγραφικά δεδομένα βασισμένα στη δομή της Κύπρου
        [Required]
        [Column("province")]
        [StringLength(50)]
        public string Province { get; set; } = string.Empty; // Λευκωσία, Λεμεσός, κλπ

        [Required]
        [Column("community")]
        [StringLength(100)]
        public string Community { get; set; } = string.Empty; // Κοινότητα/Δήμος

        [Column("address")]
        [StringLength(500)]
        public string? Address { get; set; }

        // Χαρακτηριστικά εκμετάλλευσης
        [Required]
        [Column("farm_type")]
        [StringLength(100)]
        public string FarmType { get; set; } = string.Empty; // Φυτική Παραγωγή, Ζωική Παραγωγή, κλπ

        [Column("total_area")]
        public decimal TotalArea { get; set; } // Συνολική έκταση σε στρέμματα

        [Column("size_category")]
        [StringLength(100)]
        public string? SizeCategory { get; set; } // Πολύ Μικρή (0-5 στρέμματα), κλπ

        [Column("economic_size")]
        [StringLength(100)]
        public string? EconomicSize { get; set; } // Πολύ Μικρό (0-8.000€), κλπ

        [Column("legal_status")]
        [StringLength(100)]
        public string? LegalStatus { get; set; } // Φυσικό Πρόσωπο, Εταιρεία, κλπ

        // Παραγωγικά δεδομένα
        [Column("main_crops")]
        public string? MainCrops { get; set; } // JSON array των κύριων καλλιεργειών

        [Column("livestock_types")]
        public string? LivestockTypes { get; set; } // JSON array των τύπων ζωικού κεφαλαίου

        [Column("annual_production_value")]
        public decimal? AnnualProductionValue { get; set; } // Ετήσια αξία παραγωγής

        // Τεχνικά δεδομένα
        [Column("latitude")]
        public decimal? Latitude { get; set; }

        [Column("longitude")]
        public decimal? Longitude { get; set; }

        [Column("registration_date")]
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public virtual ICollection<SampleParticipant> SampleParticipants { get; set; } = new List<SampleParticipant>();
    }
}