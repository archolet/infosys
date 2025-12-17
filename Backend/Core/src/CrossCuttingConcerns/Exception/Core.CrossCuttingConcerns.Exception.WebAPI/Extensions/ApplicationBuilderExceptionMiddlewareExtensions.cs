using Microsoft.AspNetCore.Builder;
using InfoSystem.Core.CrossCuttingConcerns.Exception.WebApi.Middleware;

namespace InfoSystem.Core.CrossCuttingConcerns.Exception.WebApi.Extensions;

public static class ApplicationBuilderExceptionMiddlewareExtensions
{
    public static void ConfigureCustomExceptionMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<ExceptionMiddleware>();
    }
}
