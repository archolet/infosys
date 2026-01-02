using System.Reflection;
using Application.Services.AuthenticatorService;
using Application.Services.AuthService;
using Application.Services.UsersService;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using InfoSystem.Core.Application.Pipelines.Authorization;
using InfoSystem.Core.Application.Pipelines.Caching;
using InfoSystem.Core.Application.Pipelines.Logging;
using InfoSystem.Core.Application.Pipelines.Transaction;
using InfoSystem.Core.Application.Pipelines.Validation;
using InfoSystem.Core.Application.Rules;
using InfoSystem.Core.CrossCuttingConcerns.Logging.Abstraction;
using InfoSystem.Core.CrossCuttingConcerns.Logging.Configurations;
using InfoSystem.Core.CrossCuttingConcerns.Logging.Serilog.File;
using InfoSystem.Core.ElasticSearch;
using InfoSystem.Core.ElasticSearch.Models;
using InfoSystem.Core.Localization.Resource.Yaml.DependencyInjection;
using InfoSystem.Core.Mailing;
using InfoSystem.Core.Mailing.MailKit;
using InfoSystem.Core.Security.DependencyInjection;
using InfoSystem.Core.Security.JWT;
using Core.CrossCuttingConcerns.FileTransfer;

namespace Application;

public static class ApplicationServiceRegistration
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        MailSettings mailSettings,
        FileLogConfiguration fileLogConfiguration,
        ElasticSearchConfig elasticSearchConfig,
        TokenOptions tokenOptions
    )
    {
        services.AddAutoMapper(cfg => cfg.AddMaps(Assembly.GetExecutingAssembly()));
        services.AddMediatR(configuration =>
        {
            configuration.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            configuration.AddOpenBehavior(typeof(AuthorizationBehavior<,>));
            configuration.AddOpenBehavior(typeof(CachingBehavior<,>));
            configuration.AddOpenBehavior(typeof(CacheRemovingBehavior<,>));
            configuration.AddOpenBehavior(typeof(LoggingBehavior<,>));
            configuration.AddOpenBehavior(typeof(RequestValidationBehavior<,>));
            configuration.AddOpenBehavior(typeof(TransactionScopeBehavior<,>));
        });

        services.AddSubClassesOfType(Assembly.GetExecutingAssembly(), typeof(BaseBusinessRules));

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        services.AddSingleton<IMailService, MailKitMailService>(_ => new MailKitMailService(mailSettings));
        services.AddSingleton<ILogger, SerilogFileLogger>(_ => new SerilogFileLogger(fileLogConfiguration));
        services.AddSingleton<IElasticSearch, ElasticSearchManager>(_ => new ElasticSearchManager(elasticSearchConfig));

        services.AddScoped<IAuthService, AuthManager>();
        services.AddScoped<IAuthenticatorService, AuthenticatorManager>();
        services.AddScoped<IUserService, UserManager>();

        services.AddYamlResourceLocalization();

        services.AddFileTransferServices();
        services.AddSecurityServices<Guid, int, Guid>(tokenOptions);

        return services;
    }

    public static IServiceCollection AddSubClassesOfType(
        this IServiceCollection services,
        Assembly assembly,
        Type type,
        Func<IServiceCollection, Type, IServiceCollection>? addWithLifeCycle = null
    )
    {
        var types = assembly.GetTypes().Where(t => t.IsSubclassOf(type) && type != t).ToList();
        foreach (Type? item in types)
            if (addWithLifeCycle == null)
                services.AddScoped(item);
            else
                addWithLifeCycle(services, type);
        return services;
    }
}
