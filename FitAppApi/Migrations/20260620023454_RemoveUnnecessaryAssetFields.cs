using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitAppApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnnecessaryAssetFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssociatedEntityId",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "AssociatedEntityType",
                table: "Assets");

            migrationBuilder.DropColumn(
                name: "Url",
                table: "Assets");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssociatedEntityId",
                table: "Assets",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AssociatedEntityType",
                table: "Assets",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Assets",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
