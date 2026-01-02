using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using Microsoft.Extensions.DependencyInjection;

namespace Core.CrossCuttingConcerns.FileTransfer;

public static class FileTransferServiceRegistration
{
    public static IServiceCollection AddFileTransferServices(this IServiceCollection services)
    {
        services.AddScoped<IFileTransferService, FileTransferService>();
        return services;
    }
}
