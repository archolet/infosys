using Application.Services.ImageService;
using Infrastructure.Adapters.Caching;
using Infrastructure.Adapters.ImageService;
using InfoSystem.Core.Application.Pipelines.Caching;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class InfrastructureServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<ImageServiceBase, CloudinaryImageServiceAdapter>();
        services.AddSingleton<ICacheManager, RedisCacheManager>();

        return services;
    }
}
