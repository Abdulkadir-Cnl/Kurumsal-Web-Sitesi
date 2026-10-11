using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddThemeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CatalogText",
                table: "Themes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Mission",
                table: "Themes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Vision",
                table: "Themes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CatalogText",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "Mission",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "Vision",
                table: "Themes");
        }
    }
}
