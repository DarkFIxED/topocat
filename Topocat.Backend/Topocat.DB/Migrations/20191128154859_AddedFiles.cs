using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Topocat.DB.Migrations
{
    public partial class AddedFiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FileReferences",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    ObjectKey = table.Column<string>(nullable: true),
                    UploadConfirmed = table.Column<bool>(nullable: false),
                    SourceFileName = table.Column<string>(nullable: true),
                    MimeType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileReferences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MapObjectFileReferences",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    FileReferenceId = table.Column<string>(nullable: true),
                    MapObjectId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MapObjectFileReferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MapObjectFileReferences_FileReferences_FileReferenceId",
                        column: x => x.FileReferenceId,
                        principalTable: "FileReferences",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MapObjectFileReferences_MapObjects_MapObjectId",
                        column: x => x.MapObjectId,
                        principalTable: "MapObjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MapObjectFileReferences_FileReferenceId",
                table: "MapObjectFileReferences",
                column: "FileReferenceId");

            migrationBuilder.CreateIndex(
                name: "IX_MapObjectFileReferences_MapObjectId",
                table: "MapObjectFileReferences",
                column: "MapObjectId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MapObjectFileReferences");

            migrationBuilder.DropTable(
                name: "FileReferences");
        }
    }
}
