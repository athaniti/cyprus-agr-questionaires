using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class InvitationsSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("invitations");
            migrationBuilder.CreateTable(
                name: "invitation_templates",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    questionnaire_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    subject = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    html_content = table.Column<string>(type: "text", nullable: true),
                    plain_text_content = table.Column<string>(type: "text", nullable: true),
                    logo_image_base64 = table.Column<string>(type: "text", nullable: true),
                    logo_alignment = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_invitation_templates", x => x.id);
                    table.ForeignKey(
                        name: "FK_sample_groups_questionnaires_questionnaire_id",
                        column: x => x.questionnaire_id,
                        principalTable: "quiestionnaires",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.CreateTable(
                name: "invitation_batches",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    invitation_template_id = table.Column<Guid>(type: "uuid", nullable: false),
                    recipient_farms = table.Column<string>(type: "jsonb", nullable: true),
                    scheduled_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    sent_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                }
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "farm_ids",
                table: "sample_groups",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "criteria",
                table: "sample_groups",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "jsonb",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 132, DateTimeKind.Utc).AddTicks(9112));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 133, DateTimeKind.Utc).AddTicks(1306));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 133, DateTimeKind.Utc).AddTicks(1319));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 133, DateTimeKind.Utc).AddTicks(1322));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 133, DateTimeKind.Utc).AddTicks(1324));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 134, DateTimeKind.Utc).AddTicks(2468));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 134, DateTimeKind.Utc).AddTicks(8800));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 11, 56, 49, 135, DateTimeKind.Utc).AddTicks(302));
        }
    }
}
