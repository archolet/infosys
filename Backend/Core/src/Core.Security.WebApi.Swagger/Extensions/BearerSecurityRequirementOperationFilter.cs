using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace NArchitecture.Core.Security.WebApi.Swagger.Extensions;

public class BearerSecurityRequirementOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        const string openApiSecurityName = "Bearer";

        var securitySchemeRef = new OpenApiSecuritySchemeReference(openApiSecurityName);

        var securityRequirement = new OpenApiSecurityRequirement
        {
            [securitySchemeRef] = new List<string>()
        };

        operation.Security ??= [];
        operation.Security.Add(securityRequirement);
    }
}
