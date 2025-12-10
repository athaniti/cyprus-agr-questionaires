using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveQuestionnaireUnusedTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("questionnaire_quotas");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "target_count",
                table: "quotas",
                newName: "targetcount");

            migrationBuilder.RenameColumn(
                name: "questionnaire_id",
                table: "quotas",
                newName: "questionnaireid");

            migrationBuilder.RenameIndex(
                name: "ix_quotas_questionnaire_id_name",
                table: "quotas",
                newName: "ix_quotas_questionnaireid_name");

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 306, DateTimeKind.Utc).AddTicks(6170));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 306, DateTimeKind.Utc).AddTicks(9225));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 306, DateTimeKind.Utc).AddTicks(9244));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 306, DateTimeKind.Utc).AddTicks(9247));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 306, DateTimeKind.Utc).AddTicks(9250));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 308, DateTimeKind.Utc).AddTicks(529));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 308, DateTimeKind.Utc).AddTicks(6248));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "created_at",
                value: new DateTime(2025, 12, 9, 16, 6, 18, 308, DateTimeKind.Utc).AddTicks(8421));
        }
    }
}
