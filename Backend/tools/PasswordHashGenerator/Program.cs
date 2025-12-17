using System.Security.Cryptography;
using System.Text;

// Password to hash
string password = "12345";

// Generate hash and salt using HMACSHA512 (same as HashingHelper)
using HMACSHA512 hmac = new();
byte[] passwordSalt = hmac.Key;
byte[] passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

// Convert to PostgreSQL bytea format (hex with \x prefix)
string saltHex = "\\x" + Convert.ToHexString(passwordSalt);
string hashHex = "\\x" + Convert.ToHexString(passwordHash);

Console.WriteLine("=== Password Hash Generator ===");
Console.WriteLine($"Password: {password}");
Console.WriteLine();
Console.WriteLine("PostgreSQL UPDATE Statement:");
Console.WriteLine("---");
Console.WriteLine($@"UPDATE ""Users"" 
SET ""Email"" = 'info@info.com.tr',
    ""PasswordSalt"" = '{saltHex}',
    ""PasswordHash"" = '{hashHex}',
    ""UpdatedDate"" = NOW()
WHERE ""Id"" = 'ef270e6c-3125-4e87-a709-fde38c7c2';");
Console.WriteLine("---");
Console.WriteLine();
Console.WriteLine("Raw values (for verification):");
Console.WriteLine($"Salt (hex): {Convert.ToHexString(passwordSalt)}");
Console.WriteLine($"Hash (hex): {Convert.ToHexString(passwordHash)}");
Console.WriteLine($"Salt length: {passwordSalt.Length} bytes");
Console.WriteLine($"Hash length: {passwordHash.Length} bytes");
