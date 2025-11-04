using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class AddFormResponsesTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create form_schemas table
            migrationBuilder.CreateTable(
                name: "form_schemas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    schema_json = table.Column<string>(type: "jsonb", nullable: false),
                    version = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_form_schemas", x => x.id);
                    table.ForeignKey(
                        name: "FK_form_schemas_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_form_schemas_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_form_schemas_users_updated_by",
                        column: x => x.updated_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Create form_responses table
            migrationBuilder.CreateTable(
                name: "form_responses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    farm_id = table.Column<Guid>(type: "uuid", nullable: false),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    form_schema_id = table.Column<Guid>(type: "uuid", nullable: true),
                    response_data = table.Column<string>(type: "jsonb", nullable: false),
                    submitted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "draft"),
                    completion_percentage = table.Column<decimal>(type: "numeric", nullable: false, defaultValue: 0),
                    interviewer_id = table.Column<Guid>(type: "uuid", nullable: true),
                    interview_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_by = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_form_responses", x => x.id);
                    table.ForeignKey(
                        name: "FK_form_responses_farms_farm_id",
                        column: x => x.farm_id,
                        principalTable: "farms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_form_responses_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_form_responses_form_schemas_form_schema_id",
                        column: x => x.form_schema_id,
                        principalTable: "form_schemas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_form_responses_users_interviewer_id",
                        column: x => x.interviewer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_form_responses_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_form_responses_users_updated_by",
                        column: x => x.updated_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Create submission_status table
            migrationBuilder.CreateTable(
                name: "submission_status",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    farm_id = table.Column<Guid>(type: "uuid", nullable: false),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sample_group_id = table.Column<Guid>(type: "uuid", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "assigned"),
                    assigned_interviewer_id = table.Column<Guid>(type: "uuid", nullable: true),
                    completion_percentage = table.Column<decimal>(type: "numeric", nullable: false, defaultValue: 0),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    deadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "medium"),
                    attempts = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    last_contact_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_submission_status", x => x.id);
                    table.ForeignKey(
                        name: "FK_submission_status_farms_farm_id",
                        column: x => x.farm_id,
                        principalTable: "farms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_submission_status_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_submission_status_sample_groups_sample_group_id",
                        column: x => x.sample_group_id,
                        principalTable: "sample_groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_submission_status_users_assigned_interviewer_id",
                        column: x => x.assigned_interviewer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            // Create indexes
            migrationBuilder.CreateIndex(
                name: "IX_form_schemas_questionnaire_id",
                table: "form_schemas",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "IX_form_schemas_questionnaire_id_version",
                table: "form_schemas",
                columns: new[] { "questionnaire_id", "version" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_form_responses_farm_id",
                table: "form_responses",
                column: "farm_id");

            migrationBuilder.CreateIndex(
                name: "IX_form_responses_questionnaire_id",
                table: "form_responses",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "IX_form_responses_status",
                table: "form_responses",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_form_responses_farm_id_questionnaire_id",
                table: "form_responses",
                columns: new[] { "farm_id", "questionnaire_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_submission_status_farm_id",
                table: "submission_status",
                column: "farm_id");

            migrationBuilder.CreateIndex(
                name: "IX_submission_status_questionnaire_id",
                table: "submission_status",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "IX_submission_status_status",
                table: "submission_status",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_submission_status_assigned_interviewer_id",
                table: "submission_status",
                column: "assigned_interviewer_id");

            migrationBuilder.CreateIndex(
                name: "IX_submission_status_farm_id_questionnaire_id",
                table: "submission_status",
                columns: new[] { "farm_id", "questionnaire_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "form_responses");
            migrationBuilder.DropTable(name: "submission_status");
            migrationBuilder.DropTable(name: "form_schemas");
        }
    }
}