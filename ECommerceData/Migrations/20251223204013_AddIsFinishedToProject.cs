using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ECommerceData.Migrations
{
    /// <inheritdoc />
    public partial class AddIsFinishedToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsFinished",
                table: "Projects",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFinished",
                table: "Projects");
        }
    }
}
