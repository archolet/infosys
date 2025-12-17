# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Build
dotnet build Backend/InfoSYS.sln

# Run all tests
dotnet test Backend/tests/StarterProject.Application.Tests/

# Run specific test
dotnet test Backend/tests/StarterProject.Application.Tests/ --filter "FullyQualifiedName~LoginTests"

# Run API (default: https://localhost:5001)
dotnet run --project Backend/src/starterProject/WebAPI/

# Format code
dotnet csharpier Backend/

# EF Core migrations
dotnet ef migrations add MigrationName --project Backend/src/starterProject/Persistence/ --startup-project Backend/src/starterProject/WebAPI/
dotnet ef database update --project Backend/src/starterProject/Persistence/ --startup-project Backend/src/starterProject/WebAPI/
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | C# 13 / .NET 10.0 |
| Architecture | Clean Architecture + CQRS |
| ORM | Entity Framework Core 10.0.1 |
| Mediator | MediatR 14.0.0 |
| Validation | FluentValidation 12.1.1 |
| Auth | JWT Bearer |
| Testing | xUnit, Moq |

## Architecture Overview

```
Backend/
├── Core/                           # Reusable framework packages
│   └── src/
│       ├── Core.Application/       # Pipeline behaviors, base abstractions
│       ├── Core.Persistence/       # EfRepositoryBase, Entity base class
│       └── Core.Security/          # JWT, Hashing, Auth entities
│
└── src/starterProject/
    ├── Domain/Entities/            # Entity classes
    ├── Application/
    │   ├── Features/               # CQRS Commands & Queries
    │   └── Services/Repositories/  # Repository interfaces
    ├── Persistence/Repositories/   # Repository implementations
    └── WebAPI/Controllers/         # Thin controllers using MediatR
```

## CQRS Pattern

Commands and queries use MediatR with **nested handler classes**:

```csharp
public class CreateUserCommand : IRequest<CreatedUserResponse>, ISecuredRequest
{
    public string Email { get; set; }
    public string[] Roles => [Admin, UsersOperationClaims.Create];

    public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, CreatedUserResponse>
    {
        public async Task<CreatedUserResponse> Handle(CreateUserCommand request, CancellationToken ct)
        {
            // Implementation
        }
    }
}
```

## Pipeline Behaviors

Implement these interfaces on commands/queries to enable cross-cutting concerns:

| Interface | Purpose | Use When |
|-----------|---------|----------|
| `ISecuredRequest` | Role-based authorization | Command/query requires authentication |
| `ICachableRequest` | Response caching | Read queries that benefit from caching |
| `ICacheRemoverRequest` | Cache invalidation | Write commands that modify cached data |
| `ILoggableRequest` | Request/response logging | Audit trail needed |
| `ITransactionalRequest` | Transaction scope | Multi-entity modifications |

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Command | `{Action}Command` | `CreateUserCommand` |
| Handler | Nested `{Action}CommandHandler` | `CreateUserCommandHandler` |
| Validator | `{Action}CommandValidator` | `CreateUserCommandValidator` |
| Response | `{Action}Response` | `CreatedUserResponse` |
| Query | `GetById{Entity}Query`, `GetList{Entity}Query` | `GetByIdUserQuery` |
| Business Rules | `{Feature}BusinessRules` | `UserBusinessRules` |
| Repository Interface | `I{Entity}Repository` | `IUserRepository` |
| Operation Claims | `{Section}.{Operation}` | `Users.Create`, `Users.Read` |

## Business Rules Pattern

Each feature has a `{Feature}BusinessRules` class with methods following this pattern:

```csharp
public class UserBusinessRules : BaseBusinessRules
{
    // Method naming: {Entity}{Field}Should{Condition}
    public async Task UserEmailShouldNotExistsWhenInsert(string email)
    {
        bool exists = await _userRepository.AnyAsync(u => u.Email == email);
        if (exists)
            await throwBusinessException(UsersMessages.UserMailAlreadyExists);
    }

    private async Task throwBusinessException(string messageKey)
    {
        string message = await _localizationService.GetLocalizedAsync(messageKey, UsersMessages.SectionName);
        throw new BusinessException(message);
    }
}
```

## Repository Pattern

```csharp
// Interface (Application/Services/Repositories/)
public interface IUserRepository : IAsyncRepository<User, Guid>, IRepository<User, Guid> { }

// Implementation (Persistence/Repositories/)
public class UserRepository : EfRepositoryBase<User, Guid, BaseDbContext>, IUserRepository
{
    public UserRepository(BaseDbContext context) : base(context) { }
}
```

## Exception Handling

Exceptions are automatically converted to HTTP responses via `ExceptionMiddleware`:

| Exception | HTTP Status | Use Case |
|-----------|-------------|----------|
| `BusinessException` | 400 Bad Request | Business rule violations |
| `ValidationException` | 400 Bad Request | FluentValidation failures |
| `AuthorizationException` | 401 Unauthorized | Missing/invalid permissions |
| `NotFoundException` | 404 Not Found | Entity not found |
| `System.Exception` | 500 Internal Server Error | Unhandled errors |

Throw in business rules:
```csharp
throw new BusinessException(message);  // Use with localized message
```

## Service Manager Pattern

For complex cross-cutting services beyond simple CRUD:

```csharp
// Interface (Application/Services/{Feature}Service/)
public interface IAuthService
{
    Task<AccessToken> CreateAccessToken(User user);
    Task<RefreshToken> CreateRefreshToken(User user, string ipAddress);
}

// Implementation
public class AuthManager : IAuthService
{
    // Inject repositories, helpers, configuration
}
```

| Service | Purpose |
|---------|---------|
| `AuthManager` | JWT tokens, refresh token rotation |
| `AuthenticatorManager` | Email/OTP 2FA |
| `UserManager` | User profile operations |

## Localization Pattern

Each feature has YAML-based localization:

```
Features/{Feature}/
├── Constants/
│   └── {Feature}Messages.cs        # Key definitions
└── Resources/Locales/
    ├── {feature}.en.yaml           # English translations
    └── {feature}.tr.yaml           # Turkish translations
```

Messages class:
```csharp
public static class UsersMessages
{
    public const string SectionName = "Users";  // Matches YAML filename
    public const string UserDontExists = "UserDontExists";
    public const string UserMailAlreadyExists = "UserMailAlreadyExists";
}
```

YAML file (`users.tr.yaml`):
```yaml
UserDontExists: "Kullanıcı bulunmuyor."
UserMailAlreadyExists: "Kullanıcı e-postası zaten mevcut."
```

Usage in business rules:
```csharp
string message = await _localizationService.GetLocalizedAsync(
    UsersMessages.UserDontExists,
    UsersMessages.SectionName);
throw new BusinessException(message);
```

## Adding a New Feature

Create these files in `Application/Features/{FeatureName}/`:

```
Features/{FeatureName}/
├── Commands/
│   └── Create/
│       ├── Create{Entity}Command.cs       # Command + Handler
│       ├── Create{Entity}CommandValidator.cs
│       └── Created{Entity}Response.cs
├── Queries/
│   ├── GetById/
│   └── GetList/
├── Rules/
│   └── {Feature}BusinessRules.cs
├── Constants/
│   ├── {Feature}OperationClaims.cs        # Role constants
│   └── {Feature}Messages.cs               # Localization keys
├── Resources/Locales/
│   ├── {feature}.en.yaml                  # English translations
│   └── {feature}.tr.yaml                  # Turkish translations
└── Profiles/
    └── MappingProfiles.cs                 # AutoMapper
```

## Configuration

- `appsettings.json` - JWT TokenOptions, ConnectionStrings, MailSettings
- Localization YAML files in `Resources/` directory

## Additional References

- `PROJECT_INDEX.md` - Detailed code index with line numbers, API endpoints, database schema, and method signatures
