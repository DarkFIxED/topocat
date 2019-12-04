using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddedObjectTags : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MapObjectTags",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    ObjectId = table.Column<string>(nullable: true),
                    Tag = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapObjectTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapObjectTags_MapObjects_ObjectId",
                        column: x => x.ObjectId,
                        principalTable: "MapObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapObjectTags_ObjectId",
                table: "MapObjectTags",
                column: "ObjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapObjectTags");
        }
    }
}
