using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddedMapMemberships : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MapMembership",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    InviterId = table.Column<string>(nullable: true),
                    MapId = table.Column<string>(nullable: true),
                    InvitedId = table.Column<string>(nullable: true),
                    Status = table.Column<int>(nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapMembership", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapMembership_AspNetUsers_InvitedId",
                        column: x => x.InvitedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MapMembership_AspNetUsers_InviterId",
                        column: x => x.InviterId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MapMembership_Maps_MapId",
                        column: x => x.MapId,
                        principalTable: "Maps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapMembership_InvitedId",
                table: "MapMembership",
                column: "InvitedId");

            migrationBuilder.CreateIndex(
                name: "IX_MapMembership_InviterId",
                table: "MapMembership",
                column: "InviterId");

            migrationBuilder.CreateIndex(
                name: "IX_MapMembership_MapId",
                table: "MapMembership",
                column: "MapId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapMembership");
        }
    }
}
