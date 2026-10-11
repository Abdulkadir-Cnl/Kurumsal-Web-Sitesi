using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddMEdia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MediaGalleryImage",
                table: "Themes",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MediaVideoImage",
                table: "Themes",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MediaGalleryImage",
                table: "Themes");

            migrationBuilder.DropColumn(
                name: "MediaVideoImage",
                table: "Themes");
        }
    }
}
