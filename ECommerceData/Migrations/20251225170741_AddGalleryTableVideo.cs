using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddGalleryTableVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Videos",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Videos");
        }
    }
}
