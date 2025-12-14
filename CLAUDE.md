# Project: InfoSys - nArchitecture Backend

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | C# 13 |
| Framework | .NET 10.0 (LTS) |
| Architecture | Clean Architecture + CQRS |
| ORM | Entity Framework Core 10.0.1 |
| Mediator | MediatR 14.0.0 |
| Mapping | AutoMapper 13.0.1 |
| Validation | FluentValidation 12.1.1 |
| Caching | Redis (StackExchange.Redis) |
| Auth | JWT Bearer (IdentityModel 8.15.0) |
| API Docs | Swagger (Swashbuckle 6.9.0) |
| Logging | Serilog 4.3.0 |
| Mailing | MailKit 4.14.1 |
| Testing | xUnit, Moq 4.20.72 |

## Project Structure

```
Backend/
├── Core/                           # NArchitecture Core packages (submodule)
│   └── src/
│       ├── Core.Application/       # Base application abstractions
│       ├── Core.Persistence/       # Repository base classes
│       ├── Core.Security/          # JWT, Hashing, Auth entities
│       └── Core.CrossCuttingConcerns/  # Logging, Exception handling
│
├── src/starterProject/
│   ├── Domain/                     # Entities
│   │   └── Entities/
│   │
│   ├── Application/                # Business logic (CQRS)
│   │   ├── Features/               # Commands & Queries
│   │   │   ├── Auth/
│   │   │   ├── Users/
│   │   │   ├── OperationClaims/
│   │   │   └── UserOperationClaims/
│   │   └── Services/               # Application services
│   │       ├── Repositories/       # Repository interfaces
│   │       ├── AuthService/
│   │       └── UsersService/
│   │
│   ├── Persistence/                # Data access
│   │   ├── Contexts/               # DbContext
│   │   ├── Repositories/           # Repository implementations
│   │   └── EntityConfigurations/   # EF configurations
│   │
│   ├── Infrastructure/             # External services
│   │   └── Adapters/
│   │
│   └── WebAPI/                     # API layer
│       └── Controllers/
│
└── tests/
    └── StarterProject.Application.Tests/
```

## Key Modules

### Auth System
- JWT token authentication
- Refresh token support
- OTP & Email authenticator
- Role-based authorization

### Features
| Feature | Commands | Queries |
|---------|----------|---------|
| Auth | Login, Register, RefreshToken, EnableOtp, EnableEmail, VerifyOtp, VerifyEmail, RevokeToken | - |
| Users | Create, Update, Delete, UpdateFromAuth | GetById, GetList |
| OperationClaims | Create, Update, Delete | GetById, GetList |
| UserOperationClaims | Create, Update, Delete | GetById, GetList |

## Coding Standards

### CQRS Pattern
- Commands: State-changing operations (Create, Update, Delete)
- Queries: Read-only operations (GetById, GetList)
- Each command/query has its own handler class

### Pipeline Behaviors (Cross-Cutting Concerns)
- `ISecuredRequest` - Authorization with role checking
- `ICachableRequest` - Response caching with Redis
- `ICacheRemoverRequest` - Cache invalidation
- `ILoggableRequest` - Request/response logging
- `ITransactionalRequest` - Transaction management

### Business Rules
- Each feature has a `{Feature}BusinessRules` class
- Rules throw `BusinessException` for validation failures
- Localization support via `ILocalizationService`

### Repository Pattern
- Interfaces in `Application/Services/Repositories/`
- Implementations in `Persistence/Repositories/`
- Base class: `EfRepositoryBase<TEntity, TEntityId, TContext>`

## Build & Test

```bash
# Restore dependencies
dotnet restore Backend/NArchitecture.sln

# Build
dotnet build Backend/NArchitecture.sln

# Run tests
dotnet test Backend/tests/StarterProject.Application.Tests/

# Run API
dotnet run --project Backend/src/starterProject/WebAPI/

# Format code
dotnet csharpier Backend/

# Analyze code
dotnet roslynator analyze Backend/NArchitecture.sln
```

## Configuration

- `appsettings.json` - WebAPI configuration
- Connection string, JWT settings, Redis, etc.
- Update-Database for EF migrations

## Statistics

### Core Packages (Backend/Core/src)
- Total Projects: 26
- C# Files: 120
- Lines of Code: 3,883

### Starter Project (Backend/src/starterProject)
- Commands: 21
- Queries: 8
- Handlers: 24
- Repositories: 6
- Business Rules: 4
- Controllers: 5
