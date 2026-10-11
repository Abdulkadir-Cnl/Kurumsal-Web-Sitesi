using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddNewUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl1",
                table: "CmsItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl2",
                table: "CmsItems",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl1",
                table: "CmsItems");

            migrationBuilder.DropColumn(
                name: "ImageUrl2",
                table: "CmsItems");
        }
    }
}
