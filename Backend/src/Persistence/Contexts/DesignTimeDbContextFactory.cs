using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;

namespace Persistence.Contexts;

/// <summary>
/// EF Core migrations için design-time DbContext factory.
/// Bu factory, migration komutları çalıştırılırken DbContext'i oluşturur.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<BaseDbContext>
{
    public BaseDbContext CreateDbContext(string[] args)
    {
        string? connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__BaseDb")
            ?? Environment.GetEnvironmentVariable("INFOSYS_CONNECTIONSTRING_BASEDB");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                "ConnectionStrings__BaseDb bulunamadi. EF migration icin environment variable tanimlayin."
            );

        IConfiguration configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string?> { ["ConnectionStrings:BaseDb"] = connectionString }
            )
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();

        // Suppress PendingModelChangesWarning for migrations
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));

        optionsBuilder.UseNpgsql(connectionString);

        return new BaseDbContext(optionsBuilder.Options, configuration);
    }
}
