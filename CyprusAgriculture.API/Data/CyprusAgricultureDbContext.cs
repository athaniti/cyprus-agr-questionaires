using Microsoft.EntityFrameworkCore;
using CyprusAgriculture.API.Models;

namespace CyprusAgriculture.API.Data
{
    public class CyprusAgricultureDbContext : DbContext
    {
        public CyprusAgricultureDbContext(DbContextOptions<CyprusAgricultureDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Questionnaire> Questionnaires { get; set; }
        public DbSet<QuestionnaireResponse> QuestionnaireResponses { get; set; }
        public DbSet<QuestionnaireInvitation> QuestionnaireInvitations { get; set; }
        public DbSet<QuestionnaireQuota> QuestionnaireQuotas { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Theme> Themes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            });

            // Configure Questionnaire entity
            modelBuilder.Entity<Questionnaire>(entity =>
            {
                entity.ToTable("questionnaires");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
                
                entity.HasOne(q => q.Creator)
                    .WithMany(u => u.CreatedQuestionnaires)
                    .HasForeignKey(q => q.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure QuestionnaireResponse entity
            modelBuilder.Entity<QuestionnaireResponse>(entity =>
            {
                entity.ToTable("questionnaire_responses");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
                
                entity.HasOne(qr => qr.Questionnaire)
                    .WithMany(q => q.Responses)
                    .HasForeignKey(qr => qr.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(qr => qr.User)
                    .WithMany(u => u.Responses)
                    .HasForeignKey(qr => qr.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure QuestionnaireInvitation entity
            modelBuilder.Entity<QuestionnaireInvitation>(entity =>
            {
                entity.ToTable("questionnaire_invitations");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
                
                entity.HasOne(qi => qi.Questionnaire)
                    .WithMany(q => q.Invitations)
                    .HasForeignKey(qi => qi.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(qi => qi.User)
                    .WithMany(u => u.Invitations)
                    .HasForeignKey(qi => qi.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure QuestionnaireQuota entity
            modelBuilder.Entity<QuestionnaireQuota>(entity =>
            {
                entity.ToTable("questionnaire_quotas");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
                
                entity.HasOne(qq => qq.Questionnaire)
                    .WithMany(q => q.Quotas)
                    .HasForeignKey(qq => qq.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure Location entity
            modelBuilder.Entity<Location>(entity =>
            {
                entity.ToTable("locations");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
                
                entity.HasOne(l => l.Parent)
                    .WithMany(l => l.Children)
                    .HasForeignKey(l => l.ParentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Theme entity
            modelBuilder.Entity<Theme>(entity =>
            {
                entity.ToTable("themes");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Cyprus regions
            var regions = new[]
            {
                new Location
                {
                    Id = Guid.Parse("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                    Name = "Λευκωσία",
                    Type = "region",
                    Code = "01",
                    Latitude = 35.1855659,
                    Longitude = 33.3822764
                },
                new Location
                {
                    Id = Guid.Parse("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                    Name = "Λεμεσός",
                    Type = "region",
                    Code = "02",
                    Latitude = 34.6753062,
                    Longitude = 33.0293005
                },
                new Location
                {
                    Id = Guid.Parse("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                    Name = "Λάρνακα",
                    Type = "region",
                    Code = "03",
                    Latitude = 34.9175971,
                    Longitude = 33.6339634
                },
                new Location
                {
                    Id = Guid.Parse("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                    Name = "Πάφος",
                    Type = "region",
                    Code = "04",
                    Latitude = 34.7766904,
                    Longitude = 32.4384267
                },
                new Location
                {
                    Id = Guid.Parse("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                    Name = "Αμμόχωστος",
                    Type = "region",
                    Code = "05",
                    Latitude = 35.1264407,
                    Longitude = 33.9463798
                }
            };

            modelBuilder.Entity<Location>().HasData(regions);

            // Seed themes
            var themes = new[]
            {
                new Theme
                {
                    Id = Guid.Parse("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                    Name = "Φυτική Παραγωγή",
                    Description = "Ερωτηματολόγια σχετικά με καλλιέργειες, σπόρους, λιπάσματα",
                    Category = "Crops"
                },
                new Theme
                {
                    Id = Guid.Parse("a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456"),
                    Name = "Κτηνοτροφία",
                    Description = "Ερωτηματολόγια για ζωικό κεφάλαιο και ζωική παραγωγή",
                    Category = "Livestock"
                },
                new Theme
                {
                    Id = Guid.Parse("b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567"),
                    Name = "Αλιεία",
                    Description = "Ερωτηματολόγια για αλιευτικές δραστηριότητες",
                    Category = "Fisheries"
                },
                new Theme
                {
                    Id = Guid.Parse("c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678"),
                    Name = "Άρδευση",
                    Description = "Ερωτηματολόγια για αρδευτικά συστήματα",
                    Category = "Irrigation"
                }
            };

            modelBuilder.Entity<Theme>().HasData(themes);
        }
    }
}