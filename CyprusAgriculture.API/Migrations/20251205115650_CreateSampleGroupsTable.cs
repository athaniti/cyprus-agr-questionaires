using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CyprusAgriculture.API.Migrations
{
    /// <inheritdoc />
    public partial class CreateSampleGroupsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "sample_groups",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    sample_id = table.Column<Guid>(type: "uuid", nullable: false),
                    interviewer_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    criteria = table.Column<string>(type: "jsonb", nullable: true),
                    farm_ids = table.Column<string>(type: "jsonb", nullable: true),
                    created_by = table.Column<Guid>(type: "uuid", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sample_groups", x => x.id);
                    table.ForeignKey(
                        name: "FK_sample_groups_samples_sample_id",
                        column: x => x.sample_id,
                        principalTable: "samples",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_sample_groups_users_interviewer_id",
                        column: x => x.interviewer_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_sample_groups_users_created_by",
                        column: x => x.created_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "farm_ids",
                table: "sample_groups");

            migrationBuilder.AddColumn<string>(
                name: "additional_data",
                table: "sample_participants",
                type: "jsonb",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "inclusion_reason",
                table: "sample_participants",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "selection_priority",
                table: "sample_participants",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "sample_participants",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "is_active",
                table: "sample_groups",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "sample_assignments",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    assigned_by = table.Column<Guid>(type: "uuid", nullable: false),
                    sample_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    notes = table.Column<string>(type: "text", nullable: true),
                    region = table.Column<string>(type: "text", nullable: true),
                    started_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sample_assignments", x => x.id);
                    table.ForeignKey(
                        name: "fk_sample_assignments_samples_sample_id",
                        column: x => x.sample_id,
                        principalTable: "samples",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sample_assignments_users_assigned_by",
                        column: x => x.assigned_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_sample_assignments_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "sample_group_farms",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    assigned_by = table.Column<Guid>(type: "uuid", nullable: false),
                    farm_id = table.Column<string>(type: "text", nullable: false),
                    sample_group_id = table.Column<Guid>(type: "uuid", nullable: false),
                    assigned_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    priority = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_sample_group_farms", x => x.id);
                    table.ForeignKey(
                        name: "fk_sample_group_farms_farms_farm_id",
                        column: x => x.farm_id,
                        principalTable: "farms",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sample_group_farms_sample_groups_sample_group_id",
                        column: x => x.sample_group_id,
                        principalTable: "sample_groups",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_sample_group_farms_users_assigned_by",
                        column: x => x.assigned_by,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("a1b2c3d4-e5f6-4789-a1b2-c3d4e5f67890"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 214, DateTimeKind.Utc).AddTicks(4126));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("b2c3d4e5-f6a7-4890-b2c3-d4e5f6a78901"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 214, DateTimeKind.Utc).AddTicks(7044));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("c3d4e5f6-a7b8-4901-c3d4-e5f6a7b89012"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 214, DateTimeKind.Utc).AddTicks(7076));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("d4e5f6a7-b8c9-4012-d4e5-f6a7b8c90123"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 214, DateTimeKind.Utc).AddTicks(7079));

            migrationBuilder.UpdateData(
                table: "locations",
                keyColumn: "id",
                keyValue: new Guid("e5f6a7b8-c9d0-4123-e5f6-a7b8c9d01234"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 214, DateTimeKind.Utc).AddTicks(7081));

            migrationBuilder.UpdateData(
                table: "themes",
                keyColumn: "id",
                keyValue: new Guid("f6a7b8c9-d0e1-4234-f6a7-b8c9d0e12345"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 215, DateTimeKind.Utc).AddTicks(9469));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 216, DateTimeKind.Utc).AddTicks(7171));

            migrationBuilder.UpdateData(
                table: "users",
                keyColumn: "id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                column: "created_at",
                value: new DateTime(2025, 12, 5, 8, 50, 34, 216, DateTimeKind.Utc).AddTicks(9162));

            migrationBuilder.CreateIndex(
                name: "ix_sample_assignments_assigned_by",
                table: "sample_assignments",
                column: "assigned_by");

            migrationBuilder.CreateIndex(
                name: "ix_sample_assignments_sample_id_user_id",
                table: "sample_assignments",
                columns: new[] { "sample_id", "user_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sample_assignments_status",
                table: "sample_assignments",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_sample_assignments_user_id",
                table: "sample_assignments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_sample_group_farms_assigned_by",
                table: "sample_group_farms",
                column: "assigned_by");

            migrationBuilder.CreateIndex(
                name: "ix_sample_group_farms_farm_id",
                table: "sample_group_farms",
                column: "farm_id");

            migrationBuilder.CreateIndex(
                name: "ix_sample_group_farms_sample_group_id_farm_id",
                table: "sample_group_farms",
                columns: new[] { "sample_group_id", "farm_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_sample_group_farms_status",
                table: "sample_group_farms",
                column: "status");
        }
    }
}
