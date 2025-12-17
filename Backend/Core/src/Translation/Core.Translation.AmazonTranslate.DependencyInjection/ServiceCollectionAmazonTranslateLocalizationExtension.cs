using Microsoft.Extensions.DependencyInjection;
using InfoSystem.Core.Translation.Abstraction;
using InfoSystem.Core.Translation.AmazonTranslate;

namespace InfoSystem.Core.Translation.AmazonTranslate.DependencyInjection;

public static class ServiceCollectionAmazonTranslateLocalizationExtension
{
    public static IServiceCollection AddAmazonTranslation(
        this IServiceCollection services,
        AmazonTranslateConfiguration configuration
    )
    {
        services.AddTransient<ITranslationService, AmazonTranslateLocalizationManager>(
            _ => new AmazonTranslateLocalizationManager(configuration)
        );
        return services;
    }
}
