using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveColumns1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.DropColumn(
                name: "category",
                table: "questionnaires");
            migrationBuilder.DropColumn(
                name: "target_responses",
                table: "questionnaires");
            migrationBuilder.DropColumn(
                name: "current_responses",
                table: "questionnaires");
            migrationBuilder.DropColumn(
                name: "published_at",
                table: "questionnaires");
            migrationBuilder.DropColumn(
                name: "closed_at",
                table: "questionnaires");

            migrationBuilder.DropColumn(
                name: "status",
                table: "samples");
            migrationBuilder.DropColumn(
                name: "current_size",
                table: "samples");
            migrationBuilder.DropColumn(
                name: "completed_at",
                table: "samples");

            migrationBuilder.DropColumn(
                name: "status",
                table: "sample_participants");

            migrationBuilder.DropColumn(
                name: "selection_priority",
                table: "sample_participants");
            
            migrationBuilder.DropColumn(
                name: "inclusion_reason",
                table: "sample_participants");

            migrationBuilder.DropColumn(
                name: "additional_data",
                table: "sample_participants");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "fk_invitations_invitation_batches_batch_id",
                table: "invitations");

            migrationBuilder.DropForeignKey(
                name: "fk_questionnaire_responses_farms_farm_id",
                table: "questionnaire_responses");

            migrationBuilder.DropForeignKey(
                name: "fk_samples_questionnaires_questionnaire_id",
                table: "samples");

            migrationBuilder.DropTable(
                name: "invitation_batches");

            migrationBuilder.DropTable(
                name: "quotaresponses");

            migrationBuilder.DropTable(
                name: "quotavariables");

            migrationBuilder.DropTable(
                name: "sample_assignments");

            migrationBuilder.DropTable(
                name: "sample_group_farms");

            migrationBuilder.DropTable(
                name: "invitation_templates");

            migrationBuilder.DropTable(
                name: "quotas");

            migrationBuilder.DropTable(
                name: "sample_groups");

            migrationBuilder.DropIndex(
                name: "ix_questionnaire_responses_farm_id",
                table: "questionnaire_responses");

            migrationBuilder.DropIndex(
                name: "ix_invitations_batch_id",
                table: "invitations");

            migrationBuilder.DropIndex(
                name: "ix_invitations_recipient_email",
                table: "invitations");

            migrationBuilder.DropIndex(
                name: "ix_invitations_status",
                table: "invitations");

            migrationBuilder.DropIndex(
                name: "ix_invitations_token",
                table: "invitations");

            migrationBuilder.DropColumn(
                name: "background_color",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "body_font",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "body_font_size",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "header_font",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "header_font_size",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "logo_image_base64",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "logo_position",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "primary_color",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "secondary_color",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "text_color",
                table: "themes");

            migrationBuilder.DropColumn(
                name: "completion_percentage",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "created_by",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "farm_id",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "notes",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "updated_by",
                table: "questionnaire_responses");

            migrationBuilder.DropColumn(
                name: "location_level",
                table: "locations");

            migrationBuilder.DropColumn(
                name: "municipality",
                table: "locations");

            migrationBuilder.DropColumn(
                name: "batch_id",
                table: "invitations");

            migrationBuilder.DropColumn(
                name: "personalization_data",
                table: "invitations");

            migrationBuilder.DropColumn(
                name: "recipient_email",
                table: "invitations");

            migrationBuilder.DropColumn(
                name: "recipient_name",
                table: "invitations");

            migrationBuilder.DropColumn(
                name: "token",
                table: "invitations");

            migrationBuilder.RenameColumn(
                name: "is_default",
                table: "themes",
                newName: "is_active");

            migrationBuilder.AddColumn<string>(
                name: "category",
                table: "themes",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<Guid>(
                name: "id",
                table: "samples",
                type: "uuid",
                nullable: false,
                defaultValueSql: "gen_random_uuid()",
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<DateTime>(
                name: "completed_at",
                table: "samples",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "current_size",
                table: "samples",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "samples",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "category",
                table: "questionnaires",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "closed_at",
                table: "questionnaires",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "current_responses",
                table: "questionnaires",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "published_at",
                table: "questionnaires",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "target_responses",
                table: "questionnaires",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "farm_name",
                table: "questionnaire_responses",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "municipality",
                table: "questionnaire_responses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "postal_code",
                table: "questionnaire_responses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "region",
                table: "questionnaire_responses",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "status",
                table: "invitations",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<string>(
                name: "delivery_status",
                table: "invitations",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "participation_status",
                table: "invitations",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

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
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                columns: new[] { "category", "created_at", "description", "name" },
                values: new object[] { "Crops", new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(6860), "Ερωτηματολόγια σχετικά με καλλιέργειες, σπόρους, λιπάσματα", "Φυτική Παραγωγή" });

            migrationBuilder.InsertData(
                table: "themes",
                columns: new[] { "id", "category", "created_at", "description", "is_active", "name", "updated_at" },
                values: new object[,]
                {
                    { new Guid("a7b8c9d0-e1f2-4345-a7b8-c9d0e1f23456"), "Livestock", new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430), "Ερωτηματολόγια για ζωικό κεφάλαιο και ζωική παραγωγή", true, "Κτηνοτροφία", null },
                    { new Guid("b8c9d0e1-f2a3-4456-b8c9-d0e1f2a34567"), "Fisheries", new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430), "Ερωτηματολόγια για αλιευτικές δραστηριότητες", true, "Αλιεία", null },
                    { new Guid("c9d0e1f2-a3b4-4567-c9d0-e1f2a3b45678"), "Irrigation", new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(7430), "Ερωτηματολόγια για αρδευτικά συστήματα", true, "Άρδευση", null }
                });

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(8190));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "created_at",
                value: new DateTime(2025, 11, 3, 21, 4, 8, 882, DateTimeKind.Utc).AddTicks(8980));

            migrationBuilder.CreateIndex(
                name: "ix_samples_created_by",
                table: "samples",
                column: "created_by");

            migrationBuilder.AddForeignKey(
                name: "fk_samples_questionnaires_questionnaire_id",
                table: "samples",
                column: "questionnaire_id",
                principalTable: "questionnaires",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "fk_samples_users_created_by",
                table: "samples",
                column: "created_by",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
