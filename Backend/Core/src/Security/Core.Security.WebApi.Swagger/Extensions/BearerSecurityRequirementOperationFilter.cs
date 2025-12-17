using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace InfoSystem.Core.Security.WebApi.Swagger.Extensions;

/// <summary>
/// Adds JWT Bearer security requirement to all API operations.
/// This filter makes Swagger UI send Authorization header with the Bearer token.
/// </summary>
public class BearerSecurityRequirementOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        // Create reference to the "Bearer" security definition (defined in Program.cs)
        var securitySchemeRef = new OpenApiSecuritySchemeReference("Bearer");
        
        // Create security requirement that references the Bearer scheme
        var securityRequirement = new OpenApiSecurityRequirement
        {
            { securitySchemeRef, new List<string>() }
        };
        
        // Add to operation's security requirements
        operation.Security ??= [];
        operation.Security.Add(securityRequirement);
    }
}
