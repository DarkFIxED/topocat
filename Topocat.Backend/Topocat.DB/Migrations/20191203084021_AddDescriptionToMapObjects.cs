using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddDescriptionToMapObjects : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "MapObjects",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "MapObjects");
        }
    }
}
