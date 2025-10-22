using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "locations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ParentName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Longitude = table.Column<double>(type: "double precision", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_locations_locations_ParentId",
                        column: x => x.ParentId,
                        principalTable: "locations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "themes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_themes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Role = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Region = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Organization = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "questionnaires",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Schema = table.Column<string>(type: "jsonb", nullable: false),
                    TargetResponses = table.Column<int>(type: "integer", nullable: false),
                    CurrentResponses = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ClosedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ThemeId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questionnaires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_questionnaires_themes_ThemeId",
                        column: x => x.ThemeId,
                        principalTable: "themes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_questionnaires_users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_invitations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    QuestionnaireId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AcceptedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    DeclinedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    InvitationToken = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questionnaire_invitations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_questionnaire_invitations_questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_questionnaire_invitations_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_quotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    QuestionnaireId = table.Column<Guid>(type: "uuid", nullable: false),
                    Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Municipality = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    TargetCount = table.Column<int>(type: "integer", nullable: false),
                    CurrentCount = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questionnaire_quotas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_questionnaire_quotas_questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_responses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    QuestionnaireId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ResponseData = table.Column<string>(type: "jsonb", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    FarmName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Municipality = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Latitude = table.Column<double>(type: "double precision", nullable: true),
                    Longitude = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_questionnaire_responses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_questionnaire_responses_questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_questionnaire_responses_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "locations",
                columns: new[] { "Id", "Code", "CreatedAt", "IsActive", "Latitude", "Longitude", "Name", "ParentId", "ParentName", "Type" },
                values: new object[,]
                {
                    { new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"), "01", new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(5195), true, 35.1855659, 33.382276400000002, "Λευκωσία", null, null, "region" },
                    { new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"), "02", new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6129), true, 34.675306200000001, 33.029300499999998, "Λεμεσός", null, null, "region" },
                    { new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"), "03", new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6135), true, 34.917597100000002, 33.633963399999999, "Λάρνακα", null, null, "region" },
                    { new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"), "04", new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6137), true, 34.7766904, 32.438426700000001, "Πάφος", null, null, "region" },
                    { new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"), "05", new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6139), true, 35.126440700000003, 33.946379800000003, "Αμμόχωστος", null, null, "region" }
                });

            migrationBuilder.InsertData(
                table: "themes",
                columns: new[] { "Id", "Category", "CreatedAt", "Description", "IsActive", "Name", "UpdatedAt" },
                values: new object[,]
                {
                    { new Guid("a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456"), "Livestock", new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1320), "Ερωτηματολόγια για ζωικό κεφάλαιο και ζωική παραγωγή", true, "Κτηνοτροφία", null },
                    { new Guid("b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567"), "Fisheries", new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1323), "Ερωτηματολόγια για αλιευτικές δραστηριότητες", true, "Αλιεία", null },
                    { new Guid("c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678"), "Irrigation", new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1325), "Ερωτηματολόγια για αρδευτικά συστήματα", true, "Άρδευση", null },
                    { new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"), "Crops", new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(720), "Ερωτηματολόγια σχετικά με καλλιέργειες, σπόρους, λιπάσματα", true, "Φυτική Παραγωγή", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_locations_ParentId",
                table: "locations",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaire_invitations_QuestionnaireId",
                table: "questionnaire_invitations",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaire_invitations_UserId",
                table: "questionnaire_invitations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaire_quotas_QuestionnaireId",
                table: "questionnaire_quotas",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaire_responses_QuestionnaireId",
                table: "questionnaire_responses",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaire_responses_UserId",
                table: "questionnaire_responses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaires_CreatedBy",
                table: "questionnaires",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_questionnaires_ThemeId",
                table: "questionnaires",
                column: "ThemeId");

            migrationBuilder.CreateIndex(
                name: "IX_users_Email",
                table: "users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "locations");

            migrationBuilder.DropTable(
                name: "questionnaire_invitations");

            migrationBuilder.DropTable(
                name: "questionnaire_quotas");

            migrationBuilder.DropTable(
                name: "questionnaire_responses");

            migrationBuilder.DropTable(
                name: "questionnaires");

            migrationBuilder.DropTable(
                name: "themes");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
