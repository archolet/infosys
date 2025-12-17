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
    private const string ConnectionString = "Host=localhost;Port=5432;Database=InfoSYSDb;Username=infosys;Password=InfoSYS_2024!";

    public BaseDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();
        
        // Suppress PendingModelChangesWarning for migrations
        optionsBuilder.ConfigureWarnings(warnings => 
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
        
        optionsBuilder.UseNpgsql(ConnectionString);

        // Design-time için minimal configuration
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:BaseDb"] = ConnectionString
            })
            .Build();

        return new BaseDbContext(optionsBuilder.Options, configuration);
    }
}
