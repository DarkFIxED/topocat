using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddMapObjects : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Maps",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    CreatedById = table.Column<string>(nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    LastModifiedAt = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Maps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Maps_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MapObject",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    LastModifiedAt = table.Column<DateTimeOffset>(nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    MapId = table.Column<string>(nullable: true),
                    Start_Latitude = table.Column<double>(nullable: true),
                    Start_Longitude = table.Column<double>(nullable: true),
                    End_Latitude = table.Column<double>(nullable: true),
                    End_Longitude = table.Column<double>(nullable: true),
                    Coordinates_Latitude = table.Column<double>(nullable: true),
                    Coordinates_Longitude = table.Column<double>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapObject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapObject_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapObject_MapId",
                table: "MapObject",
                column: "MapId");

            migrationBuilder.CreateIndex(
                name: "IX_Maps_CreatedById",
                table: "Maps",
                column: "CreatedById");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapObject");

            migrationBuilder.DropTable(
                name: "Maps");
        }
    }
}
