using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddMimeType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MimeType",
                table: "FileReferences",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MimeType",
                table: "FileReferences");
        }
    }
}
