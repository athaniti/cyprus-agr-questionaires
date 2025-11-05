using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class AddQuotaTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create QuotaVariables table
            migrationBuilder.CreateTable(
                name: "QuotaVariables",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    VariableType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DataType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PossibleValues = table.Column<string>(type: "jsonb", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotaVariables", x => x.Id);
                });

            // Create Quotas table
            migrationBuilder.CreateTable(
                name: "Quotas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    QuestionnaireId = table.Column<Guid>(type: "uuid", nullable: false),
                    Criteria = table.Column<string>(type: "jsonb", nullable: false),
                    TargetCount = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    AutoStop = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    Priority = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UpdatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quotas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Quotas_Questionnaires_QuestionnaireId",
                        column: x => x.QuestionnaireId,
                        principalTable: "Questionnaires",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Create QuotaResponses table
            migrationBuilder.CreateTable(
                name: "QuotaResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    QuotaId = table.Column<Guid>(type: "uuid", nullable: false),
                    ParticipantId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AllocationDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ResponseId = table.Column<Guid>(type: "uuid", nullable: true),
                    Metadata = table.Column<string>(type: "jsonb", nullable: true),
                    AllocatedBy = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    AllocationMethod = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "manual")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotaResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotaResponses_Quotas_QuotaId",
                        column: x => x.QuotaId,
                        principalTable: "Quotas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Create indexes for better performance
            migrationBuilder.CreateIndex(
                name: "IX_QuotaVariables_Name",
                table: "QuotaVariables",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuotaVariables_IsActive",
                table: "QuotaVariables",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Quotas_QuestionnaireId",
                table: "Quotas",
                column: "QuestionnaireId");

            migrationBuilder.CreateIndex(
                name: "IX_Quotas_IsActive",
                table: "Quotas",
                column: "IsActive");

            migrationBuilder.CreateIndex(
                name: "IX_Quotas_Priority",
                table: "Quotas",
                column: "Priority");

            migrationBuilder.CreateIndex(
                name: "IX_QuotaResponses_QuotaId",
                table: "QuotaResponses",
                column: "QuotaId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotaResponses_ParticipantId",
                table: "QuotaResponses",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotaResponses_Status",
                table: "QuotaResponses",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_QuotaResponses_AllocationDate",
                table: "QuotaResponses",
                column: "AllocationDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QuotaResponses");

            migrationBuilder.DropTable(
                name: "Quotas");

            migrationBuilder.DropTable(
                name: "QuotaVariables");
        }
    }
}