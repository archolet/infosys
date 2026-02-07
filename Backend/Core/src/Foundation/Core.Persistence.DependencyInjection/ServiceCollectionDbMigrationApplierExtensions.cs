using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using InfoSystem.Core.Persistence.DbMigrationApplier;

namespace InfoSystem.Core.Persistence.DependencyInjection;

public static class ServiceCollectionDbMigrationApplierExtensions
{
    public static IServiceCollection AddDbMigrationApplier<TDbContext>(
        this IServiceCollection services,
        Func<IServiceProvider, TDbContext> contextFactory
    )
        where TDbContext : DbContext
    {
        _ = services.AddTransient<IDbMigrationApplierService, DbMigrationApplierManager<TDbContext>>(
            provider => new DbMigrationApplierManager<TDbContext>(contextFactory(provider))
        );
        _ = services.AddTransient<IDbMigrationApplierService<TDbContext>, DbMigrationApplierManager<TDbContext>>(
            provider => new DbMigrationApplierManager<TDbContext>(contextFactory(provider))
        );

        return services;
    }
}
