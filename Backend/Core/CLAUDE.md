# NArchitecture Core Packages

Bu dizin, nArchitecture framework'unun temel (core) paketlerini içeren .NET class library solution'udur. Starter Project ve diğer uygulamalar bu paketleri kullanır.

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | C# 13 |
| Framework | .NET 10.0 |
| ORM | Entity Framework Core 10.0.1 |
| Mediator | MediatR 14.0.0 |
| Validation | FluentValidation 12.1.1 |
| Caching | Microsoft.Extensions.Caching.Abstractions |
| JWT | Microsoft.IdentityModel.Tokens 8.15.0 |
| OTP | Otp.NET 1.4.1 |
| Logging | Serilog 4.3.0 |
| Mailing | MailKit 4.14.1, MimeKit 4.14.0 |
| Search | NEST 7.17.5 (Elasticsearch) |
| Translation | Amazon Translate |

## Project Structure

```
Core/
├── CorePackages.sln          # Solution file (26 projects)
└── src/
    ├── Core.Application/     # CQRS pipelines, base abstractions
    ├── Core.Persistence/     # EF Core repository base classes
    ├── Core.Security/        # JWT, hashing, auth entities
    │
    ├── Core.CrossCuttingConcerns.Exception/        # Exception types
    ├── Core.CrossCuttingConcerns.Exception.WebAPI/ # HTTP problem details
    ├── Core.CrossCuttingConcerns.Logging/          # Log models
    ├── Core.CrossCuttingConcerns.Logging.Abstraction/
    ├── Core.CrossCuttingConcerns.Logging.SeriLog/
    ├── Core.CrossCuttingConcerns.Logging.Serilog.File/
    ├── Core.CrossCuttingConcerns.Logging.DependencyInjection/
    │
    ├── Core.Mailing/         # Mail abstractions
    ├── Core.Mailing.MailKit/ # MailKit implementation
    │
    ├── Core.Localization.Abstraction/
    ├── Core.Localization.Resource.Yaml/
    ├── Core.Localization.Resource.Yaml.DependencyInjection/
    ├── Core.Localization.Translation/
    ├── Core.Localization.WebApi/
    │
    ├── Core.Translation.Abstraction/
    ├── Core.Translation.AmazonTranslate/
    ├── Core.Translation.AmazonTranslate.DependencyInjection/
    │
    ├── Core.ElasticSearch/   # Elasticsearch integration
    │
    ├── Core.Persistence.DependencyInjection/
    ├── Core.Persistence.WebApi/
    ├── Core.Security.DependencyInjection/
    ├── Core.Security.WebApi.Swagger/
    │
    └── Core.Test/            # Test utilities
```

## Key Modules

### Core.Application
CQRS pattern için MediatR pipeline behaviors:

| Interface | Purpose |
|-----------|---------|
| `ISecuredRequest` | Role-based authorization |
| `ICachableRequest` | Response caching |
| `ICacheRemoverRequest` | Cache invalidation |
| `ILoggableRequest` | Request/response logging |
| `ITransactionalRequest` | Transaction scope |
| `IIntervalRequest` | Performance monitoring |

Base classes:
- `BaseBusinessRules` - Business rule validation base
- `PageRequest` - Pagination request model
- `GetListResponse<T>` - Paginated list response

### Core.Persistence
Entity Framework Core repository pattern:

- `Entity<TId>` - Base entity with audit fields
- `IAsyncRepository<TEntity, TId>` - Async repository interface
- `IRepository<TEntity, TId>` - Sync repository interface
- `EfRepositoryBase<TEntity, TId, TContext>` - EF Core implementation
- `IPaginate<T>` - Pagination result
- `DynamicQuery` - Dynamic filtering/sorting

Features:
- Soft delete support with cascade
- Audit timestamps (CreatedDate, UpdatedDate, DeletedDate)
- Dynamic LINQ queries
- Query filters for soft-deleted entities

### Core.Security
Authentication and authorization:

**JWT:**
- `ITokenHelper` / `JwtHelper` - Token generation
- `AccessToken` - Token model
- `TokenOptions` - Configuration

**Hashing:**
- `HashingHelper` - Password hashing (HMACSHA512)

**OTP:**
- `IOtpAuthenticatorHelper` - OTP interface
- `OtpNetOtpAuthenticatorHelper` - OTP.NET implementation

**Email Auth:**
- `IEmailAuthenticatorHelper` - Email verification

**Entities:**
- `User` - User entity
- `OperationClaim` - Permission entity
- `UserOperationClaim` - User-permission mapping
- `RefreshToken` - Refresh token entity
- `OtpAuthenticator` - OTP configuration
- `EmailAuthenticator` - Email verification

### Core.CrossCuttingConcerns.Exception
Exception types:
- `BusinessException` - Business rule violations
- `ValidationException` - FluentValidation errors
- `AuthorizationException` - Authorization failures
- `NotFoundException` - Entity not found

### Core.CrossCuttingConcerns.Logging
Structured logging with Serilog:
- `LogDetail` - Log entry model
- `LogParameter` - Parameter logging
- `SerilogLoggerServiceBase` - Base logger
- `SerilogFileLogger` - File output

## Usage Examples

### Repository Implementation
```csharp
// Interface (Application layer)
public interface IUserRepository : IAsyncRepository<User, Guid>, IRepository<User, Guid>
{
}

// Implementation (Persistence layer)
public class UserRepository : EfRepositoryBase<User, Guid, AppDbContext>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }
}
```

### Secured Command
```csharp
public class CreateUserCommand : IRequest<CreatedUserResponse>, ISecuredRequest
{
    public string[] Roles => new[] { "Admin", "Users.Create" };

    // Properties...

    public class Handler : IRequestHandler<CreateUserCommand, CreatedUserResponse>
    {
        // Implementation...
    }
}
```

### Cacheable Query
```csharp
public class GetListUserQuery : IRequest<GetListResponse<UserDto>>, ICachableRequest
{
    public bool BypassCache => false;
    public string CacheKey => $"Users({PageRequest.PageIndex},{PageRequest.PageSize})";
    public string? CacheGroupKey => "Users";
    public TimeSpan? SlidingExpiration => TimeSpan.FromMinutes(5);
}
```

## Build Commands

```bash
# Restore dependencies
dotnet restore CorePackages.sln

# Build all packages
dotnet build CorePackages.sln

# Build specific project
dotnet build src/Core.Application/Core.Application.csproj

# Run tests
dotnet test src/Core.Test/Core.Test.csproj

# Format code
dotnet csharpier .
```

## Namespace Convention

All packages use `NArchitecture.Core.*` namespace pattern:
- `NArchitecture.Core.Application.Pipelines.*`
- `NArchitecture.Core.Persistence.Repositories`
- `NArchitecture.Core.Security.JWT`
- `NArchitecture.Core.CrossCuttingConcerns.*`

## Statistics

| Metric | Value |
|--------|-------|
| Total Projects | 26 |
| C# Files | 198 |
| Lines of Code | 4,767 |
| Pipeline Behaviors | 7 |
| Repository Interfaces | 2 (IAsyncRepository, IRepository) |
| Last Indexed | 2025-12-14T23:35:00Z |

## Detected Patterns

| Pattern | Status | Evidence |
|---------|--------|----------|
| CQRS | Active | MediatR 14.0.0, 7 Pipeline Behaviors |
| Repository | Active | EfRepositoryBase, IAsyncRepository |
| Clean Architecture | Active | Layered package structure |
| Dependency Injection | Active | DI Extension packages |

## Dependencies Between Packages

```
Core.Application
├── Core.Security
├── Core.CrossCuttingConcerns.Logging
├── Core.CrossCuttingConcerns.Logging.Abstraction
└── Core.CrossCuttingConcerns.Exception

Core.Security
└── Core.Persistence

Core.Mailing.MailKit
└── Core.Mailing

Core.CrossCuttingConcerns.Logging.SeriLog
├── Core.CrossCuttingConcerns.Logging
└── Core.CrossCuttingConcerns.Logging.Abstraction

Core.Localization.Resource.Yaml
└── Core.Localization.Abstraction
```
