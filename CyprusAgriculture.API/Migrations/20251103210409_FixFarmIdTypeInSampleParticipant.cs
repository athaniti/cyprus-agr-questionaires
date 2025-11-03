using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class FixFarmIdTypeInSampleParticipant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_locations_locations_ParentId",
                table: "locations");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaire_invitations_questionnaires_QuestionnaireId",
                table: "questionnaire_invitations");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaire_invitations_users_UserId",
                table: "questionnaire_invitations");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaire_quotas_questionnaires_QuestionnaireId",
                table: "questionnaire_quotas");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaire_responses_questionnaires_QuestionnaireId",
                table: "questionnaire_responses");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaire_responses_users_UserId",
                table: "questionnaire_responses");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaires_themes_ThemeId",
                table: "questionnaires");

            migrationBuilder.DropForeignKey(
                name: "FK_questionnaires_users_CreatedBy",
                table: "questionnaires");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_themes",
                table: "themes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_questionnaires",
                table: "questionnaires");

            migrationBuilder.DropPrimaryKey(
                name: "PK_questionnaire_responses",
                table: "questionnaire_responses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_questionnaire_quotas",
                table: "questionnaire_quotas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_questionnaire_invitations",
                table: "questionnaire_invitations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_locations",
                table: "locations");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "users",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "users",
                newName: "region");

            migrationBuilder.RenameColumn(
                name: "Organization",
                table: "users",
                newName: "organization");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "users",
                newName: "last_name");

            migrationBuilder.RenameColumn(
                name: "LastLoginAt",
                table: "users",
                newName: "last_login_at");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "users",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "users",
                newName: "first_name");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "users",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_users_Email",
                table: "users",
                newName: "ix_users_email");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "themes",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "themes",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "themes",
                newName: "category");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "themes",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "themes",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "themes",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "themes",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "questionnaires",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Schema",
                table: "questionnaires",
                newName: "schema");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "questionnaires",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "questionnaires",
                newName: "description");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "questionnaires",
                newName: "category");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "questionnaires",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "questionnaires",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "ThemeId",
                table: "questionnaires",
                newName: "theme_id");

            migrationBuilder.RenameColumn(
                name: "TargetResponses",
                table: "questionnaires",
                newName: "target_responses");

            migrationBuilder.RenameColumn(
                name: "PublishedAt",
                table: "questionnaires",
                newName: "published_at");

            migrationBuilder.RenameColumn(
                name: "CurrentResponses",
                table: "questionnaires",
                newName: "current_responses");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "questionnaires",
                newName: "created_by");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "questionnaires",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "ClosedAt",
                table: "questionnaires",
                newName: "closed_at");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaires_ThemeId",
                table: "questionnaires",
                newName: "ix_questionnaires_theme_id");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaires_CreatedBy",
                table: "questionnaires",
                newName: "ix_questionnaires_created_by");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "questionnaire_responses",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "questionnaire_responses",
                newName: "region");

            migrationBuilder.RenameColumn(
                name: "Municipality",
                table: "questionnaire_responses",
                newName: "municipality");

            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "questionnaire_responses",
                newName: "longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "questionnaire_responses",
                newName: "latitude");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "questionnaire_responses",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "questionnaire_responses",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "SubmittedAt",
                table: "questionnaire_responses",
                newName: "submitted_at");

            migrationBuilder.RenameColumn(
                name: "StartedAt",
                table: "questionnaire_responses",
                newName: "started_at");

            migrationBuilder.RenameColumn(
                name: "ResponseData",
                table: "questionnaire_responses",
                newName: "response_data");

            migrationBuilder.RenameColumn(
                name: "QuestionnaireId",
                table: "questionnaire_responses",
                newName: "questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "PostalCode",
                table: "questionnaire_responses",
                newName: "postal_code");

            migrationBuilder.RenameColumn(
                name: "FarmName",
                table: "questionnaire_responses",
                newName: "farm_name");

            migrationBuilder.RenameColumn(
                name: "CompletedAt",
                table: "questionnaire_responses",
                newName: "completed_at");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_responses_UserId",
                table: "questionnaire_responses",
                newName: "ix_questionnaire_responses_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_responses_QuestionnaireId",
                table: "questionnaire_responses",
                newName: "ix_questionnaire_responses_questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "questionnaire_quotas",
                newName: "region");

            migrationBuilder.RenameColumn(
                name: "Municipality",
                table: "questionnaire_quotas",
                newName: "municipality");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "questionnaire_quotas",
                newName: "category");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "questionnaire_quotas",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "questionnaire_quotas",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "TargetCount",
                table: "questionnaire_quotas",
                newName: "target_count");

            migrationBuilder.RenameColumn(
                name: "QuestionnaireId",
                table: "questionnaire_quotas",
                newName: "questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "CurrentCount",
                table: "questionnaire_quotas",
                newName: "current_count");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "questionnaire_quotas",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_quotas_QuestionnaireId",
                table: "questionnaire_quotas",
                newName: "ix_questionnaire_quotas_questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "questionnaire_invitations",
                newName: "status");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "questionnaire_invitations",
                newName: "message");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "questionnaire_invitations",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "questionnaire_invitations",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "questionnaire_invitations",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "SentAt",
                table: "questionnaire_invitations",
                newName: "sent_at");

            migrationBuilder.RenameColumn(
                name: "QuestionnaireId",
                table: "questionnaire_invitations",
                newName: "questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "InvitationToken",
                table: "questionnaire_invitations",
                newName: "invitation_token");

            migrationBuilder.RenameColumn(
                name: "ExpiresAt",
                table: "questionnaire_invitations",
                newName: "expires_at");

            migrationBuilder.RenameColumn(
                name: "DeclinedAt",
                table: "questionnaire_invitations",
                newName: "declined_at");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "questionnaire_invitations",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "AcceptedAt",
                table: "questionnaire_invitations",
                newName: "accepted_at");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_invitations_UserId",
                table: "questionnaire_invitations",
                newName: "ix_questionnaire_invitations_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_questionnaire_invitations_QuestionnaireId",
                table: "questionnaire_invitations",
                newName: "ix_questionnaire_invitations_questionnaire_id");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "locations",
                newName: "type");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "locations",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Longitude",
                table: "locations",
                newName: "longitude");

            migrationBuilder.RenameColumn(
                name: "Latitude",
                table: "locations",
                newName: "latitude");

            migrationBuilder.RenameColumn(
                name: "Code",
                table: "locations",
                newName: "code");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "locations",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ParentName",
                table: "locations",
                newName: "parent_name");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "locations",
                newName: "parent_id");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "locations",
                newName: "is_active");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "locations",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_locations_ParentId",
                table: "locations",
                newName: "ix_locations_parent_id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_themes",
                table: "themes",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_questionnaires",
                table: "questionnaires",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_questionnaire_responses",
                table: "questionnaire_responses",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_questionnaire_quotas",
                table: "questionnaire_quotas",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_questionnaire_invitations",
                table: "questionnaire_invitations",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "pk_locations",
                table: "locations",
                column: "id");

            migrationBuilder.CreateTable(
                name: "farms",
                columns: table => new
                {
                    id = table.Column<string>(type: "text", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    farm_code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    owner_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    contact_phone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    contact_email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    province = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    community = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    address = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    farm_type = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    total_area = table.Column<decimal>(type: "numeric", nullable: false),
                    size_category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    economic_size = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    legal_status = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    main_crops = table.Column<string>(type: "text", nullable: true),
                    livestock_types = table.Column<string>(type: "text", nullable: true),
                    annual_production_value = table.Column<decimal>(type: "numeric", nullable: true),
                    latitude = table.Column<decimal>(type: "numeric", nullable: true),
                    longitude = table.Column<decimal>(type: "numeric", nullable: true),
                    registration_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_farms", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "samples",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    target_size = table.Column<int>(type: "integer", nullable: false),
                    current_size = table.Column<int>(type: "integer", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    filter_criteria = table.Column<string>(type: "jsonb", nullable: false),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_samples", x => x.id);
                    table.ForeignKey(
                        name: "fk_samples_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_samples_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "sample_participants",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    sample_id = table.Column<Guid>(type: "uuid", nullable: false),
                    farm_id = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    selection_priority = table.Column<int>(type: "integer", nullable: false),
                    inclusion_reason = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    additional_data = table.Column<string>(type: "jsonb", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sample_participants", x => x.id);
                    table.ForeignKey(
                        name: "fk_sample_participants_farms_farm_id",
                        column: x => x.farm_id,
                        principalTable: "farms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sample_participants_samples_sample_id",
                        column: x => x.sample_id,
                        principalTable: "samples",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "invitations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    sample_id = table.Column<Guid>(type: "uuid", nullable: false),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    participant_id = table.Column<Guid>(type: "uuid", nullable: true),
                    subject = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    html_content = table.Column<string>(type: "text", nullable: false),
                    plain_text_content = table.Column<string>(type: "text", nullable: true),
                    logo_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    logo_alignment = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    style_settings = table.Column<string>(type: "jsonb", nullable: false),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    send_immediately = table.Column<bool>(type: "boolean", nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    delivery_status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    delivered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    opened_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    clicked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    delivery_error = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    participation_status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invitations", x => x.id);
                    table.ForeignKey(
                        name: "fk_invitations_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_invitations_sample_participants_participant_id",
                        column: x => x.participant_id,
                        principalTable: "sample_participants",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "fk_invitations_samples_sample_id",
                        column: x => x.sample_id,
                        principalTable: "samples",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_invitations_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(2430));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(3550));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(3560));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(3560));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(3560));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(6860));

            migrationBuilder.InsertData(
                table: "users",
                columns: new[] { "id", "created_at", "email", "first_name", "is_active", "last_login_at", "last_name", "organization", "region", "role" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(8190), "admin@agriculture.gov.cy", "System", true, null, "User", null, null, "Administrator" },
                    { new Guid("11111111-1111-1111-1111-111111111111"), new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(8980), "user@agriculture.gov.cy", "Demo", true, null, "User", null, null, "User" }
                });

            migrationBuilder.CreateIndex(
                name: "ix_farms_farm_code",
                table: "farms",
                column: "farm_code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_invitations_created_by",
                table: "invitations",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_participant_id",
                table: "invitations",
                column: "participant_id");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_questionnaire_id",
                table: "invitations",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_sample_id",
                table: "invitations",
                column: "sample_id");

            migrationBuilder.CreateIndex(
                name: "ix_sample_participants_farm_id",
                table: "sample_participants",
                column: "farm_id");

            migrationBuilder.CreateIndex(
                name: "ix_sample_participants_sample_id",
                table: "sample_participants",
                column: "sample_id");

            migrationBuilder.CreateIndex(
                name: "ix_samples_created_by",
                table: "samples",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_samples_questionnaire_id",
                table: "samples",
                column: "questionnaire_id");

            migrationBuilder.AddForeignKey(
                name: "fk_locations_locations_parent_id",
                table: "locations",
                column: "parent_id",
                principalTable: "locations",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_invitations_questionnaires_questionnaire_id",
                table: "questionnaire_invitations",
                column: "questionnaire_id",
                principalTable: "questionnaires",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_invitations_users_user_id",
                table: "questionnaire_invitations",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_quotas_questionnaires_questionnaire_id",
                table: "questionnaire_quotas",
                column: "questionnaire_id",
                principalTable: "questionnaires",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_responses_questionnaires_questionnaire_id",
                table: "questionnaire_responses",
                column: "questionnaire_id",
                principalTable: "questionnaires",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaire_responses_users_user_id",
                table: "questionnaire_responses",
                column: "user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaires_themes_theme_id",
                table: "questionnaires",
                column: "theme_id",
                principalTable: "themes",
                principalColumn: "id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "fk_questionnaires_users_created_by",
                table: "questionnaires",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_locations_locations_parent_id",
                table: "locations");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_invitations_questionnaires_questionnaire_id",
                table: "questionnaire_invitations");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_invitations_users_user_id",
                table: "questionnaire_invitations");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_quotas_questionnaires_questionnaire_id",
                table: "questionnaire_quotas");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_responses_questionnaires_questionnaire_id",
                table: "questionnaire_responses");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_responses_users_user_id",
                table: "questionnaire_responses");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaires_themes_theme_id",
                table: "questionnaires");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaires_users_created_by",
                table: "questionnaires");

            migrationBuilder.DropTable(
                name: "invitations");

            migrationBuilder.DropTable(
                name: "sample_participants");

            migrationBuilder.DropTable(
                name: "farms");

            migrationBuilder.DropTable(
                name: "samples");

            migrationBuilder.DropPrimaryKey(
                name: "pk_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "pk_themes",
                table: "themes");

            migrationBuilder.DropPrimaryKey(
                name: "pk_questionnaires",
                table: "questionnaires");

            migrationBuilder.DropPrimaryKey(
                name: "pk_questionnaire_responses",
                table: "questionnaire_responses");

            migrationBuilder.DropPrimaryKey(
                name: "pk_questionnaire_quotas",
                table: "questionnaire_quotas");

            migrationBuilder.DropPrimaryKey(
                name: "pk_questionnaire_invitations",
                table: "questionnaire_invitations");

            migrationBuilder.DropPrimaryKey(
                name: "pk_locations",
                table: "locations");

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.RenameColumn(
                name: "role",
                table: "users",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "region",
                table: "users",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "organization",
                table: "users",
                newName: "Organization");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "last_name",
                table: "users",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "last_login_at",
                table: "users",
                newName: "LastLoginAt");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "users",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "first_name",
                table: "users",
                newName: "FirstName");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "users",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_users_email",
                table: "users",
                newName: "IX_users_Email");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "themes",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "themes",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "category",
                table: "themes",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "themes",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "themes",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "themes",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "themes",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "questionnaires",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "schema",
                table: "questionnaires",
                newName: "Schema");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "questionnaires",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "description",
                table: "questionnaires",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "category",
                table: "questionnaires",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "questionnaires",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "questionnaires",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "theme_id",
                table: "questionnaires",
                newName: "ThemeId");

            migrationBuilder.RenameColumn(
                name: "target_responses",
                table: "questionnaires",
                newName: "TargetResponses");

            migrationBuilder.RenameColumn(
                name: "published_at",
                table: "questionnaires",
                newName: "PublishedAt");

            migrationBuilder.RenameColumn(
                name: "current_responses",
                table: "questionnaires",
                newName: "CurrentResponses");

            migrationBuilder.RenameColumn(
                name: "created_by",
                table: "questionnaires",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "questionnaires",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "closed_at",
                table: "questionnaires",
                newName: "ClosedAt");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaires_theme_id",
                table: "questionnaires",
                newName: "IX_questionnaires_ThemeId");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaires_created_by",
                table: "questionnaires",
                newName: "IX_questionnaires_CreatedBy");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "questionnaire_responses",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "region",
                table: "questionnaire_responses",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "municipality",
                table: "questionnaire_responses",
                newName: "Municipality");

            migrationBuilder.RenameColumn(
                name: "longitude",
                table: "questionnaire_responses",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "latitude",
                table: "questionnaire_responses",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "questionnaire_responses",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "questionnaire_responses",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "submitted_at",
                table: "questionnaire_responses",
                newName: "SubmittedAt");

            migrationBuilder.RenameColumn(
                name: "started_at",
                table: "questionnaire_responses",
                newName: "StartedAt");

            migrationBuilder.RenameColumn(
                name: "response_data",
                table: "questionnaire_responses",
                newName: "ResponseData");

            migrationBuilder.RenameColumn(
                name: "questionnaire_id",
                table: "questionnaire_responses",
                newName: "QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "postal_code",
                table: "questionnaire_responses",
                newName: "PostalCode");

            migrationBuilder.RenameColumn(
                name: "farm_name",
                table: "questionnaire_responses",
                newName: "FarmName");

            migrationBuilder.RenameColumn(
                name: "completed_at",
                table: "questionnaire_responses",
                newName: "CompletedAt");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaire_responses_user_id",
                table: "questionnaire_responses",
                newName: "IX_questionnaire_responses_UserId");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaire_responses_questionnaire_id",
                table: "questionnaire_responses",
                newName: "IX_questionnaire_responses_QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "region",
                table: "questionnaire_quotas",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "municipality",
                table: "questionnaire_quotas",
                newName: "Municipality");

            migrationBuilder.RenameColumn(
                name: "category",
                table: "questionnaire_quotas",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "questionnaire_quotas",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "updated_at",
                table: "questionnaire_quotas",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "target_count",
                table: "questionnaire_quotas",
                newName: "TargetCount");

            migrationBuilder.RenameColumn(
                name: "questionnaire_id",
                table: "questionnaire_quotas",
                newName: "QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "current_count",
                table: "questionnaire_quotas",
                newName: "CurrentCount");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "questionnaire_quotas",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaire_quotas_questionnaire_id",
                table: "questionnaire_quotas",
                newName: "IX_questionnaire_quotas_QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "status",
                table: "questionnaire_invitations",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "message",
                table: "questionnaire_invitations",
                newName: "Message");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "questionnaire_invitations",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "questionnaire_invitations",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "questionnaire_invitations",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "sent_at",
                table: "questionnaire_invitations",
                newName: "SentAt");

            migrationBuilder.RenameColumn(
                name: "questionnaire_id",
                table: "questionnaire_invitations",
                newName: "QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "invitation_token",
                table: "questionnaire_invitations",
                newName: "InvitationToken");

            migrationBuilder.RenameColumn(
                name: "expires_at",
                table: "questionnaire_invitations",
                newName: "ExpiresAt");

            migrationBuilder.RenameColumn(
                name: "declined_at",
                table: "questionnaire_invitations",
                newName: "DeclinedAt");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "questionnaire_invitations",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "accepted_at",
                table: "questionnaire_invitations",
                newName: "AcceptedAt");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaire_invitations_user_id",
                table: "questionnaire_invitations",
                newName: "IX_questionnaire_invitations_UserId");

            migrationBuilder.RenameIndex(
                name: "ix_questionnaire_invitations_questionnaire_id",
                table: "questionnaire_invitations",
                newName: "IX_questionnaire_invitations_QuestionnaireId");

            migrationBuilder.RenameColumn(
                name: "type",
                table: "locations",
                newName: "Type");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "locations",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "longitude",
                table: "locations",
                newName: "Longitude");

            migrationBuilder.RenameColumn(
                name: "latitude",
                table: "locations",
                newName: "Latitude");

            migrationBuilder.RenameColumn(
                name: "code",
                table: "locations",
                newName: "Code");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "locations",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "parent_name",
                table: "locations",
                newName: "ParentName");

            migrationBuilder.RenameColumn(
                name: "parent_id",
                table: "locations",
                newName: "ParentId");

            migrationBuilder.RenameColumn(
                name: "is_active",
                table: "locations",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "locations",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "ix_locations_parent_id",
                table: "locations",
                newName: "IX_locations_ParentId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_themes",
                table: "themes",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_questionnaires",
                table: "questionnaires",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_questionnaire_responses",
                table: "questionnaire_responses",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_questionnaire_quotas",
                table: "questionnaire_quotas",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_questionnaire_invitations",
                table: "questionnaire_invitations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_locations",
                table: "locations",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(5195));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "Id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6129));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "Id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6135));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "Id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6137));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "Id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 680, DateTimeKind.Utc).AddTicks(6139));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "Id",
                keyValue: new Guid("a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1320));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "Id",
                keyValue: new Guid("b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1323));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "Id",
                keyValue: new Guid("c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(1325));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "Id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "CreatedAt",
                value: new DateTime(2025, 10, 22, 7, 48, 9, 681, DateTimeKind.Utc).AddTicks(720));

            migrationBuilder.AddForeignKey(
                name: "FK_locations_locations_ParentId",
                table: "locations",
                column: "ParentId",
                principalTable: "locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaire_invitations_questionnaires_QuestionnaireId",
                table: "questionnaire_invitations",
                column: "QuestionnaireId",
                principalTable: "questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaire_invitations_users_UserId",
                table: "questionnaire_invitations",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaire_quotas_questionnaires_QuestionnaireId",
                table: "questionnaire_quotas",
                column: "QuestionnaireId",
                principalTable: "questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaire_responses_questionnaires_QuestionnaireId",
                table: "questionnaire_responses",
                column: "QuestionnaireId",
                principalTable: "questionnaires",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaire_responses_users_UserId",
                table: "questionnaire_responses",
                column: "UserId",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaires_themes_ThemeId",
                table: "questionnaires",
                column: "ThemeId",
                principalTable: "themes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_questionnaires_users_CreatedBy",
                table: "questionnaires",
                column: "CreatedBy",
                principalTable: "users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
