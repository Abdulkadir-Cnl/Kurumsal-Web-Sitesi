using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectIdToGallery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProjectId",
                table: "Galleries",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "Galleries");
        }
    }
}
