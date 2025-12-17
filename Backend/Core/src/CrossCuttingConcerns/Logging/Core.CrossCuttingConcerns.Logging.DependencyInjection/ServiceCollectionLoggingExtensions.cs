using Microsoft.Extensions.DependencyInjection;
using InfoSystem.Core.CrossCuttingConcerns.Logging.Abstraction;

namespace InfoSystem.Core.CrossCuttingConcerns.Logging.DependencyInjection;

public static class ServiceCollectionLoggingExtensions
{
    public static IServiceCollection AddLogging(this IServiceCollection services, ILogger logger)
    {
        services.AddSingleton(logger);

        return services;
    }
}
