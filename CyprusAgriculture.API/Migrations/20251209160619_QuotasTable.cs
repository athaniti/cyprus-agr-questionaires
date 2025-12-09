using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class QuotasTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "quotas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    criteria = table.Column<string>(type: "jsonb", nullable: false),
                    target_count = table.Column<int>(type: "int", nullable:false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_quotas", x => x.id);
                    table.ForeignKey(
                        name: "FK_quotas_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_invitation_batches_invitation_templates_invitation_template",
                table: "invitation_batches");

            migrationBuilder.DropColumn(
                name: "recipient_farms",
                table: "invitation_batches");

            migrationBuilder.RenameColumn(
                name: "logo_image_base64",
                table: "invitation_templates",
                newName: "logo_url");

            migrationBuilder.RenameColumn(
                name: "logo_alignment",
                table: "invitation_templates",
                newName: "logo_position");

            migrationBuilder.RenameColumn(
                name: "scheduled_at",
                table: "invitation_batches",
                newName: "updated_at");

            migrationBuilder.RenameColumn(
                name: "invitation_template_id",
                table: "invitation_batches",
                newName: "template_id");

            migrationBuilder.RenameIndex(
                name: "ix_invitation_batches_invitation_template_id",
                table: "invitation_batches",
                newName: "ix_invitation_batches_template_id");

            migrationBuilder.AddColumn<bool>(
                name: "autostop",
                table: "quotas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "createdat",
                table: "quotas",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "createdby",
                table: "quotas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "isactive",
                table: "quotas",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "priority",
                table: "quotas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "updatedat",
                table: "quotas",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "updatedby",
                table: "quotas",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "completed_at",
                table: "questionnaire_responses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "submitted_at",
                table: "questionnaire_responses",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "updated_by",
                table: "questionnaire_responses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "available_variables",
                table: "invitation_templates",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "body_font_family",
                table: "invitation_templates",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "body_font_size",
                table: "invitation_templates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "invitation_templates",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                table: "invitation_templates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "header_font_family",
                table: "invitation_templates",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "header_font_size",
                table: "invitation_templates",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "invitation_templates",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "name",
                table: "invitation_batches",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<int>(
                name: "clicked_invitations",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "completed_responses",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "invitation_batches",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<Guid>(
                name: "created_by",
                table: "invitation_batches",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<int>(
                name: "delivered_invitations",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "failed_invitations",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "immediate_send",
                table: "invitation_batches",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "opened_invitations",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "questionnaire_id",
                table: "invitation_batches",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "recipients",
                table: "invitation_batches",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "scheduled_send_time",
                table: "invitation_batches",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "started_responses",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "total_invitations",
                table: "invitation_batches",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "invitations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    batch_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    participant_id = table.Column<Guid>(type: "uuid", nullable: true),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sample_id = table.Column<Guid>(type: "uuid", nullable: false),
                    clicked_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    delivered_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    delivery_error = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    delivery_status = table.Column<int>(type: "integer", nullable: false),
                    description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    html_content = table.Column<string>(type: "text", nullable: false),
                    logo_alignment = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    logo_url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    opened_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    personalization_data = table.Column<string>(type: "text", nullable: true),
                    plain_text_content = table.Column<string>(type: "text", nullable: true),
                    recipient_email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    recipient_name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    send_immediately = table.Column<bool>(type: "boolean", nullable: false),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false),
                    style_settings = table.Column<string>(type: "jsonb", nullable: false),
                    subject = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    token = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_invitations", x => x.id);
                    table.ForeignKey(
                        name: "fk_invitations_invitation_batches_batch_id",
                        column: x => x.batch_id,
                        principalTable: "invitation_batches",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
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

            migrationBuilder.CreateTable(
                name: "questionnaire_invitations",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    accepted_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    declined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    invitation_token = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_questionnaire_invitations", x => x.id);
                    table.ForeignKey(
                        name: "fk_questionnaire_invitations_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_questionnaire_invitations_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "questionnaire_quotas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    current_count = table.Column<int>(type: "integer", nullable: false),
                    municipality = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    region = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    target_count = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_questionnaire_quotas", x => x.id);
                    table.ForeignKey(
                        name: "fk_questionnaire_quotas_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "questionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "quotaresponses",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    quotaid = table.Column<Guid>(type: "uuid", nullable: false),
                    allocatedby = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    allocationdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    allocationmethod = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    completiondate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    metadata = table.Column<string>(type: "jsonb", nullable: true),
                    participantid = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    responseid = table.Column<Guid>(type: "uuid", nullable: true),
                    startdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_quotaresponses", x => x.id);
                    table.ForeignKey(
                        name: "fk_quotaresponses_quotas_quota_id",
                        column: x => x.quotaid,
                        principalTable: "quotas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "quotavariables",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    createdat = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    datatype = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    displayname = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    isactive = table.Column<bool>(type: "boolean", nullable: false),
                    name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    possiblevalues = table.Column<string>(type: "jsonb", nullable: false),
                    sortorder = table.Column<int>(type: "integer", nullable: false),
                    updatedat = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    variabletype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_quotavariables", x => x.id);
                });

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 979, DateTimeKind.Utc).AddTicks(2569));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 979, DateTimeKind.Utc).AddTicks(5986));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 979, DateTimeKind.Utc).AddTicks(6009));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 979, DateTimeKind.Utc).AddTicks(6011));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 979, DateTimeKind.Utc).AddTicks(6013));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 980, DateTimeKind.Utc).AddTicks(8091));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 982, DateTimeKind.Utc).AddTicks(1492));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 14, 32, 55, 982, DateTimeKind.Utc).AddTicks(3599));

            migrationBuilder.CreateIndex(
                name: "ix_quotas_isactive",
                table: "quotas",
                column: "isactive");

            migrationBuilder.CreateIndex(
                name: "ix_invitation_templates_created_by",
                table: "invitation_templates",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_invitation_batches_created_by",
                table: "invitation_batches",
                column: "created_by");

            migrationBuilder.CreateIndex(
                name: "ix_invitation_batches_questionnaire_id",
                table: "invitation_batches",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "ix_invitation_batches_scheduled_send_time",
                table: "invitation_batches",
                column: "scheduled_send_time");

            migrationBuilder.CreateIndex(
                name: "ix_invitation_batches_status",
                table: "invitation_batches",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_batch_id",
                table: "invitations",
                column: "batch_id");

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
                name: "ix_invitations_recipient_email",
                table: "invitations",
                column: "recipient_email");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_sample_id",
                table: "invitations",
                column: "sample_id");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_status",
                table: "invitations",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_invitations_token",
                table: "invitations",
                column: "token",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_questionnaire_invitations_questionnaire_id",
                table: "questionnaire_invitations",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "ix_questionnaire_invitations_user_id",
                table: "questionnaire_invitations",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_questionnaire_quotas_questionnaire_id",
                table: "questionnaire_quotas",
                column: "questionnaire_id");

            migrationBuilder.CreateIndex(
                name: "ix_quotaresponses_quota_id",
                table: "quotaresponses",
                column: "quotaid");

            migrationBuilder.CreateIndex(
                name: "ix_quotaresponses_status",
                table: "quotaresponses",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_quotavariables_isactive",
                table: "quotavariables",
                column: "isactive");

            migrationBuilder.CreateIndex(
                name: "ix_quotavariables_name",
                table: "quotavariables",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_quotavariables_variabletype",
                table: "quotavariables",
                column: "variabletype");

            migrationBuilder.AddForeignKey(
                name: "fk_invitation_batches_invitation_templates_template_id",
                table: "invitation_batches",
                column: "template_id",
                principalTable: "invitation_templates",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_invitation_batches_questionnaires_questionnaire_id",
                table: "invitation_batches",
                column: "questionnaire_id",
                principalTable: "questionnaires",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_invitation_batches_users_created_by",
                table: "invitation_batches",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_invitation_templates_users_created_by",
                table: "invitation_templates",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
