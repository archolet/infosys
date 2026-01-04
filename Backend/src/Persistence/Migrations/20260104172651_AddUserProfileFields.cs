using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUserProfileFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserOperationClaims",
                keyColumn: "Id",
                keyValue: new Guid("8a39313e-baf8-4d5c-a56f-ee93da4a9914"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("ef270e6c-3125-4e87-a709-fde38c7c261e"));

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AuthenticatorType", "CreatedDate", "DeletedDate", "Email", "FirstName", "LastName", "PasswordHash", "PasswordSalt", "Status", "UpdatedDate" },
                values: new object[] { new Guid("4e232d43-f63f-4649-a9ef-986d115a1fc5"), 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "info@info.com.tr", "Admin", "User", new byte[] { 182, 85, 101, 2, 8, 20, 202, 71, 154, 11, 106, 14, 254, 229, 41, 34, 132, 229, 104, 143, 18, 196, 133, 234, 210, 180, 216, 55, 2, 157, 9, 248, 241, 34, 62, 163, 81, 246, 128, 185, 166, 251, 126, 144, 157, 116, 84, 100, 12, 85, 166, 235, 26, 205, 48, 229, 111, 112, 32, 72, 132, 45, 109, 160 }, new byte[] { 10, 123, 39, 100, 107, 129, 242, 198, 162, 78, 213, 121, 162, 142, 200, 41, 98, 106, 178, 66, 59, 94, 116, 56, 158, 255, 92, 67, 93, 174, 103, 213, 105, 226, 67, 159, 10, 91, 217, 237, 164, 19, 214, 19, 55, 43, 205, 177, 155, 93, 183, 159, 224, 101, 141, 138, 245, 190, 10, 208, 150, 141, 60, 233, 139, 54, 91, 123, 6, 57, 131, 4, 78, 69, 113, 236, 201, 46, 97, 249, 220, 213, 178, 154, 215, 214, 152, 193, 0, 26, 185, 249, 18, 9, 239, 195, 201, 123, 221, 88, 125, 62, 248, 226, 7, 9, 65, 176, 103, 147, 133, 194, 52, 229, 21, 24, 85, 161, 21, 85, 1, 177, 216, 112, 233, 37, 40, 110 }, true, null });

            migrationBuilder.InsertData(
                table: "UserOperationClaims",
                columns: new[] { "Id", "CreatedDate", "DeletedDate", "OperationClaimId", "UpdatedDate", "UserId" },
                values: new object[] { new Guid("ec5a0f27-2b14-4279-9990-4ac0113495e8"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1, null, new Guid("4e232d43-f63f-4649-a9ef-986d115a1fc5") });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "UserOperationClaims",
                keyColumn: "Id",
                keyValue: new Guid("ec5a0f27-2b14-4279-9990-4ac0113495e8"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("4e232d43-f63f-4649-a9ef-986d115a1fc5"));

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Users");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AuthenticatorType", "CreatedDate", "DeletedDate", "Email", "PasswordHash", "PasswordSalt", "UpdatedDate" },
                values: new object[] { new Guid("ef270e6c-3125-4e87-a709-fde38c7c261e"), 0, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "narch@kodlama.io", new byte[] { 96, 153, 150, 152, 73, 140, 153, 36, 141, 111, 66, 1, 19, 162, 74, 113, 140, 207, 105, 236, 76, 49, 82, 243, 209, 101, 60, 103, 223, 103, 236, 219, 254, 165, 183, 245, 199, 109, 255, 83, 252, 231, 193, 233, 39, 123, 125, 129, 221, 158, 36, 39, 143, 126, 99, 98, 234, 232, 19, 163, 43, 255, 33, 103 }, new byte[] { 78, 174, 88, 9, 69, 178, 92, 244, 98, 18, 149, 40, 39, 76, 186, 187, 108, 125, 195, 131, 23, 44, 212, 20, 161, 49, 193, 159, 57, 245, 85, 38, 141, 42, 249, 35, 45, 64, 93, 3, 216, 9, 40, 167, 198, 176, 87, 134, 238, 106, 56, 224, 133, 72, 254, 54, 233, 48, 176, 55, 234, 169, 70, 104, 66, 165, 129, 170, 93, 216, 184, 52, 163, 159, 69, 15, 76, 0, 110, 39, 195, 139, 103, 109, 189, 167, 199, 86, 231, 127, 123, 59, 115, 168, 1, 134, 228, 94, 188, 137, 123, 215, 70, 38, 217, 170, 135, 95, 217, 191, 233, 26, 170, 150, 109, 238, 233, 35, 242, 246, 64, 10, 130, 103, 27, 94, 34, 212 }, null });

            migrationBuilder.InsertData(
                table: "UserOperationClaims",
                columns: new[] { "Id", "CreatedDate", "DeletedDate", "OperationClaimId", "UpdatedDate", "UserId" },
                values: new object[] { new Guid("8a39313e-baf8-4d5c-a56f-ee93da4a9914"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1, null, new Guid("ef270e6c-3125-4e87-a709-fde38c7c261e") });
        }
    }
}
