using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProjectFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomerCount",
                table: "Themes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ExperienceYear",
                table: "Themes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProjectCount",
                table: "Themes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TeamCount",
                table: "Themes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerCount",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "ExperienceYear",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "ProjectCount",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "TeamCount",
                table: "Themes");
        }
    }
}
