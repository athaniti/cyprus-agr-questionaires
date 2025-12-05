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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                // This will only be used if no options are provided (shouldn't happen in our case)
                optionsBuilder.UseNpgsql();
            }
            
            // Suppress the pending model changes warning for development
            optionsBuilder.ConfigureWarnings(warnings => 
                warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Questionnaire> Questionnaires { get; set; }
        public DbSet<QuestionnaireResponse> QuestionnaireResponses { get; set; }
        public DbSet<QuestionnaireInvitation> QuestionnaireInvitations { get; set; }
        public DbSet<QuestionnaireQuota> QuestionnaireQuotas { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Farm> Farms { get; set; }
        public DbSet<Sample> Samples { get; set; }
        public DbSet<SampleParticipant> SampleParticipants { get; set; }
        public DbSet<SampleGroup> SampleGroups { get; set; }
        public DbSet<Invitation> Invitations { get; set; }
        public DbSet<Theme> Themes { get; set; }
        
        // New invitation management entities
        public DbSet<InvitationTemplate> InvitationTemplates { get; set; }
        public DbSet<InvitationBatch> InvitationBatches { get; set; }

        // Quota management entities
        public DbSet<Quota> Quotas { get; set; }
        public DbSet<QuotaResponse> QuotaResponses { get; set; }
        public DbSet<QuotaVariable> QuotaVariables { get; set; }

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

                entity.HasOne(q => q.Theme)
                    .WithMany(t => t.Questionnaires)
                    .HasForeignKey(q => q.ThemeId)
                    .OnDelete(DeleteBehavior.SetNull);
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
                
                entity.HasOne(fr => fr.Farm)
                    .WithMany()
                    .HasForeignKey(fr => fr.FarmId)
                    .OnDelete(DeleteBehavior.Cascade);
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

                        // Configure Sample entity  
            modelBuilder.Entity<Sample>(entity =>
            {
                entity.ToTable("samples");
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id).HasColumnName("id");
                entity.Property(s => s.Name).HasColumnName("name").IsRequired().HasMaxLength(200);
                entity.Property(s => s.Description).HasColumnName("description").HasMaxLength(1000);
                entity.Property(s => s.TargetSize).HasColumnName("target_size").IsRequired();
                entity.Property(s => s.FilterCriteria).HasColumnName("filter_criteria").HasColumnType("jsonb");
                entity.Property(s => s.QuestionnaireId).HasColumnName("questionnaire_id");
                entity.Property(s => s.CreatedBy).HasColumnName("created_by").IsRequired();
                entity.Property(s => s.CreatedAt).HasColumnName("created_at");
                entity.Property(s => s.UpdatedAt).HasColumnName("updated_at");
            });

            // Configure SampleParticipant entity
            modelBuilder.Entity<SampleParticipant>(entity =>
            {
                entity.ToTable("sample_participants");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(sp => sp.Sample)
                    .WithMany(s => s.Participants)
                    .HasForeignKey(sp => sp.SampleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sp => sp.Farm)
                    .WithMany(f => f.SampleParticipants)
                    .HasForeignKey(sp => sp.FarmId)
                    .OnDelete(DeleteBehavior.Cascade);
            });


            // Configure SampleGroup entity
            modelBuilder.Entity<SampleGroup>(entity =>
            {
                entity.ToTable("sample_groups");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(sg => sg.Sample)
                    .WithMany()
                    .HasForeignKey(sg => sg.SampleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sg => sg.Interviewer)
                    .WithMany()
                    .HasForeignKey(sg => sg.InterviewerId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(sg => sg.CreatedByUser)
                    .WithMany()
                    .HasForeignKey(sg => sg.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(sg => sg.SampleId);
                entity.HasIndex(sg => sg.InterviewerId);
            });

            // Configure Invitation entity
            modelBuilder.Entity<Invitation>(entity =>
            {
                entity.ToTable("invitations");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(i => i.Batch)
                    .WithMany(b => b.Invitations)
                    .HasForeignKey(i => i.BatchId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(i => i.Sample)
                    .WithMany(s => s.Invitations)
                    .HasForeignKey(i => i.SampleId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(i => i.Questionnaire)
                    .WithMany()
                    .HasForeignKey(i => i.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(i => i.Participant)
                    .WithMany(p => p.Invitations)
                    .HasForeignKey(i => i.ParticipantId)
                    .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(i => i.Creator)
                    .WithMany()
                    .HasForeignKey(i => i.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(i => i.Token).IsUnique();
                entity.HasIndex(i => i.RecipientEmail);
                entity.HasIndex(i => i.Status);
            });

            // Configure InvitationTemplate entity
            modelBuilder.Entity<InvitationTemplate>(entity =>
            {
                entity.ToTable("invitation_templates");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(it => it.Questionnaire)
                    .WithMany()
                    .HasForeignKey(it => it.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(it => it.Creator)
                    .WithMany()
                    .HasForeignKey(it => it.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(it => it.QuestionnaireId);
                entity.HasIndex(it => it.Name);
            });

            // Configure InvitationBatch entity
            modelBuilder.Entity<InvitationBatch>(entity =>
            {
                entity.ToTable("invitation_batches");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                entity.HasOne(ib => ib.Template)
                    .WithMany(t => t.InvitationBatches)
                    .HasForeignKey(ib => ib.TemplateId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ib => ib.Questionnaire)
                    .WithMany()
                    .HasForeignKey(ib => ib.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(ib => ib.Creator)
                    .WithMany()
                    .HasForeignKey(ib => ib.CreatedBy)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(ib => ib.QuestionnaireId);
                entity.HasIndex(ib => ib.Status);
                entity.HasIndex(ib => ib.ScheduledSendTime);
            });

            // Configure Farm entity
            modelBuilder.Entity<Farm>(entity =>
            {
                entity.ToTable("farms");
                entity.Property(e => e.Id).HasDefaultValueSql("gen_random_uuid()");

                // Create unique index on farm_code
                entity.HasIndex(f => f.FarmCode).IsUnique();
            });

            // Configure Quota entity
            modelBuilder.Entity<Quota>(entity =>
            {
                entity.ToTable("quotas");
                
                entity.Property(e => e.QuestionnaireId).HasColumnName("questionnaireid");
                entity.Property(e => e.TargetCount).HasColumnName("targetcount");
                entity.Property(e => e.IsActive).HasColumnName("isactive");
                entity.Property(e => e.AutoStop).HasColumnName("autostop");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
                entity.Property(e => e.UpdatedAt).HasColumnName("updatedat");
                entity.Property(e => e.CreatedBy).HasColumnName("createdby");
                entity.Property(e => e.UpdatedBy).HasColumnName("updatedby");
                
                entity.HasOne(q => q.Questionnaire)
                    .WithMany()
                    .HasForeignKey(q => q.QuestionnaireId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(q => q.QuestionnaireId);
                entity.HasIndex(q => q.IsActive);
                entity.HasIndex(q => new { q.QuestionnaireId, q.Name });
            });

            // Configure QuotaResponse entity
            modelBuilder.Entity<QuotaResponse>(entity =>
            {
                entity.ToTable("quotaresponses");

                entity.Property(e => e.QuotaId).HasColumnName("quotaid");
                entity.Property(e => e.ParticipantId).HasColumnName("participantid");
                entity.Property(e => e.AllocationDate).HasColumnName("allocationdate");
                entity.Property(e => e.StartDate).HasColumnName("startdate");
                entity.Property(e => e.CompletionDate).HasColumnName("completiondate");
                entity.Property(e => e.ResponseId).HasColumnName("responseid");
                entity.Property(e => e.AllocatedBy).HasColumnName("allocatedby");
                entity.Property(e => e.AllocationMethod).HasColumnName("allocationmethod");

                entity.HasOne(qr => qr.Quota)
                    .WithMany(q => q.QuotaResponses)
                    .HasForeignKey(qr => qr.QuotaId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(qr => qr.QuotaId);
                entity.HasIndex(qr => qr.Status);
            });

            // Configure QuotaVariable entity
            modelBuilder.Entity<QuotaVariable>(entity =>
            {
                entity.ToTable("quotavariables");

                entity.Property(e => e.DisplayName).HasColumnName("displayname");
                entity.Property(e => e.VariableType).HasColumnName("variabletype");
                entity.Property(e => e.DataType).HasColumnName("datatype");
                entity.Property(e => e.PossibleValues).HasColumnName("possiblevalues");
                entity.Property(e => e.IsActive).HasColumnName("isactive");
                entity.Property(e => e.SortOrder).HasColumnName("sortorder");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
                entity.Property(e => e.UpdatedAt).HasColumnName("updatedat");

                entity.HasIndex(qv => qv.Name).IsUnique();
                entity.HasIndex(qv => qv.IsActive);
                entity.HasIndex(qv => qv.VariableType);
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
                    Name = "Κλασικό Θέμα Κύπρου",
                    Description = "Παραδοσιακό θέμα με τα χρώματα της Κύπρου",
                    IsDefault = true,
                    PrimaryColor = "#006400",
                    SecondaryColor = "#FFD700",
                    BackgroundColor = "#FFFFFF",
                    TextColor = "#000000",
                    BodyFont = "Arial, sans-serif",
                    BodyFontSize = 14,
                    HeaderFont = "Georgia, serif",
                    HeaderFontSize = 18,
                    LogoPosition = "left",
                    LogoImageBase64 = "data:image/jpeg;base64,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"
                }
            };

            modelBuilder.Entity<Theme>().HasData(themes);

            // Seed default users
            var users = new[]
            {
                new User
                {
                    Id = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                    FirstName = "System",
                    LastName = "User",
                    Email = "admin@agriculture.gov.cy",
                    Role = "Administrator",
                    IsActive = true
                },
                new User
                {
                    Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    FirstName = "Demo",
                    LastName = "User",
                    Email = "user@agriculture.gov.cy",
                    Role = "User",
                    IsActive = true
                }
            };

            modelBuilder.Entity<User>().HasData(users);
        }
    }
}