using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitAppApi.Migrations
{
    /// <inheritdoc />
    public partial class WorkoutExerciseOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "WorkoutExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "WorkoutExercises");
        }
    }
}
