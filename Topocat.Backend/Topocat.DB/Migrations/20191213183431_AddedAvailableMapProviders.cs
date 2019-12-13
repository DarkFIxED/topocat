using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddedAvailableMapProviders : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AvailableMapProviders",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    Google = table.Column<bool>(nullable: false),
                    Yandex = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AvailableMapProviders", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_AvailableMapProviders_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql($"INSERT INTO AvailableMapProviders (UserId, Google, Yandex)" +
                                 $"SELECT Id, 1, 1 FROM AspNetUsers");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AvailableMapProviders");
        }
    }
}
