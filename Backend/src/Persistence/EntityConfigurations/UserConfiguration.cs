using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users").HasKey(u => u.Id);

        builder.Property(u => u.Id).HasColumnName("Id").IsRequired();
        builder.Property(u => u.Email).HasColumnName("Email").IsRequired();
        builder.Property(u => u.PasswordSalt).HasColumnName("PasswordSalt").IsRequired();
        builder.Property(u => u.PasswordHash).HasColumnName("PasswordHash").IsRequired();
        builder.Property(u => u.AuthenticatorType).HasColumnName("AuthenticatorType").IsRequired();
        builder.Property(u => u.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(u => u.UpdatedDate).HasColumnName("UpdatedDate");
        builder.Property(u => u.DeletedDate).HasColumnName("DeletedDate");

        builder.HasQueryFilter(u => !u.DeletedDate.HasValue);

        builder.HasMany(u => u.UserOperationClaims);
        builder.HasMany(u => u.RefreshTokens);
        builder.HasMany(u => u.EmailAuthenticators);
        builder.HasMany(u => u.OtpAuthenticators);

        builder.HasData(_seeds);

        builder.HasBaseType((string)null!);
    }

    public static Guid AdminId { get; } = Guid.Parse("4e232d43-f63f-4649-a9ef-986d115a1fc5");

    private IEnumerable<User> _seeds
    {
        get
        {
            User adminUser =
                new()
                {
                    Id = AdminId,
                    Email = "info@info.com.tr",
                    FirstName = "Admin",
                    LastName = "User",
                    Status = true,
                    PasswordHash =
                    [
                        182,
                        85,
                        101,
                        2,
                        8,
                        20,
                        202,
                        71,
                        154,
                        11,
                        106,
                        14,
                        254,
                        229,
                        41,
                        34,
                        132,
                        229,
                        104,
                        143,
                        18,
                        196,
                        133,
                        234,
                        210,
                        180,
                        216,
                        55,
                        2,
                        157,
                        9,
                        248,
                        241,
                        34,
                        62,
                        163,
                        81,
                        246,
                        128,
                        185,
                        166,
                        251,
                        126,
                        144,
                        157,
                        116,
                        84,
                        100,
                        12,
                        85,
                        166,
                        235,
                        26,
                        205,
                        48,
                        229,
                        111,
                        112,
                        32,
                        72,
                        132,
                        45,
                        109,
                        160
                    ],
                    PasswordSalt =
                    [
                        10,
                        123,
                        39,
                        100,
                        107,
                        129,
                        242,
                        198,
                        162,
                        78,
                        213,
                        121,
                        162,
                        142,
                        200,
                        41,
                        98,
                        106,
                        178,
                        66,
                        59,
                        94,
                        116,
                        56,
                        158,
                        255,
                        92,
                        67,
                        93,
                        174,
                        103,
                        213,
                        105,
                        226,
                        67,
                        159,
                        10,
                        91,
                        217,
                        237,
                        164,
                        19,
                        214,
                        19,
                        55,
                        43,
                        205,
                        177,
                        155,
                        93,
                        183,
                        159,
                        224,
                        101,
                        141,
                        138,
                        245,
                        190,
                        10,
                        208,
                        150,
                        141,
                        60,
                        233,
                        139,
                        54,
                        91,
                        123,
                        6,
                        57,
                        131,
                        4,
                        78,
                        69,
                        113,
                        236,
                        201,
                        46,
                        97,
                        249,
                        220,
                        213,
                        178,
                        154,
                        215,
                        214,
                        152,
                        193,
                        0,
                        26,
                        185,
                        249,
                        18,
                        9,
                        239,
                        195,
                        201,
                        123,
                        221,
                        88,
                        125,
                        62,
                        248,
                        226,
                        7,
                        9,
                        65,
                        176,
                        103,
                        147,
                        133,
                        194,
                        52,
                        229,
                        21,
                        24,
                        85,
                        161,
                        21,
                        85,
                        1,
                        177,
                        216,
                        112,
                        233,
                        37,
                        40,
                        110
                    ]
                };
            yield return adminUser;
        }
    }
}
