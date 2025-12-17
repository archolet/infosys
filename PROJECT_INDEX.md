# Project Index

> Updated: 2025-12-18 | Version: 1.1.0 | InfoSYS - .NET 10.0 Clean Architecture Backend with CQRS (PostgreSQL)

## Project Structure

```
Backend/
├── Core/                                    # InfoSYS Core packages (26 projects, 120 files)
│   └── src/
│       ├── Foundation/                      # Temel yapı taşları
│       │   ├── Core.Application/            # CQRS pipelines, base abstractions (15 files)
│       │   │   ├── Pipelines/               # MediatR pipeline behaviors
│       │   │   │   ├── Authorization/       # Role-based auth (ISecuredRequest)
│       │   │   │   ├── Caching/             # Distributed cache (ICachableRequest)
│       │   │   │   ├── Logging/             # Request logging (ILoggableRequest)
│       │   │   │   ├── Performance/         # Performance monitoring (IIntervalRequest)
│       │   │   │   ├── Transaction/         # Transaction scope (ITransactionalRequest)
│       │   │   │   └── Validation/          # FluentValidation integration
│       │   │   ├── Dtos/                    # Base DTOs
│       │   │   ├── Requests/                # PageRequest
│       │   │   ├── Responses/               # GetListResponse<T>, IResponse
│       │   │   └── Rules/                   # BaseBusinessRules
│       │   │
│       │   ├── Core.Persistence/            # EF Core repository base (18 files)
│       │   │   ├── Repositories/            # EfRepositoryBase, Entity<TId>
│       │   │   ├── Paging/                  # IPaginate<T>, Paginate<T>
│       │   │   ├── Dynamic/                 # DynamicQuery, Filter, Sort
│       │   │   └── DbMigrationApplier/      # Auto migration support
│       │   │
│       │   └── Core.Persistence.WebApi/     # Persistence middleware
│       │
│       ├── Security/                        # Güvenlik
│       │   ├── Core.Security/               # JWT, Hashing, Auth (21 files)
│       │   │   ├── JWT/                     # JwtHelper, TokenOptions, AccessToken
│       │   │   ├── Hashing/                 # HashingHelper (HMACSHA512)
│       │   │   ├── Encryption/              # SecurityKeyHelper, SigningCredentialsHelper
│       │   │   ├── OtpAuthenticator/        # OtpNetOtpAuthenticatorHelper
│       │   │   ├── EmailAuthenticator/      # EmailAuthenticatorHelper
│       │   │   ├── Entities/                # User, OperationClaim, RefreshToken, etc.
│       │   │   ├── Extensions/              # ClaimExtensions, ClaimsPrincipalExtensions
│       │   │   └── Constants/               # GeneralOperationClaims
│       │   │
│       │   ├── Core.Security.WebApi.Swagger/# Swagger JWT security
│       │   └── Core.Security.DependencyInjection/
│       │
│       ├── CrossCuttingConcerns/            # Kesişen ilgiler (8 projects)
│       │   ├── Exception/                   # Exception types
│       │   │   ├── Core.CrossCuttingConcerns.Exception/    # BusinessException, ValidationException
│       │   │   └── Core.CrossCuttingConcerns.Exception.WebApi/ # HTTP ProblemDetails, Middleware
│       │   │
│       │   └── Logging/                     # Logging infrastructure
│       │       ├── Core.CrossCuttingConcerns.Logging/           # LogDetail, LogParameter
│       │       ├── Core.CrossCuttingConcerns.Logging.Abstraction/ # ILogger interface
│       │       ├── Core.CrossCuttingConcerns.Logging.SeriLog/   # SerilogLoggerServiceBase
│       │       └── Core.CrossCuttingConcerns.Logging.Serilog.File/ # SerilogFileLogger
│       │
│       ├── Communication/                   # İletişim
│       │   ├── Mailing/                     # E-posta
│       │   │   ├── Core.Mailing/            # Mail abstractions (4 files)
│       │   │   └── Core.Mailing.MailKit/    # MailKit implementation
│       │   ├── Sms/                         # SMS services
│       │   └── Push/                        # Push notifications
│       │
│       ├── Localization/                    # Lokalizasyon (5 projects)
│       │   ├── Core.Localization.Abstraction/
│       │   ├── Core.Localization.Resource.Yaml/
│       │   ├── Core.Localization.Resource.Yaml.DependencyInjection/
│       │   ├── Core.Localization.Translation/
│       │   └── Core.Localization.WebApi/
│       │
│       ├── Integration/                     # Dış entegrasyonlar
│       │   └── Core.ElasticSearch/          # NEST Elasticsearch (14 files)
│       │
│       ├── Translation/                     # Çeviri (3 projects)
│       │   ├── Core.Translation.Abstraction/
│       │   ├── Core.Translation.AmazonTranslate/
│       │   └── Core.Translation.AmazonTranslate.DependencyInjection/
│       │
│       └── Testing/                         # Test
│           └── Core.Test/                   # Test utilities (4 files)
│
├── src/                                     # Main application (119 files, 4,330 LOC)
│   ├── Domain/                              # Entities (6 entities)
│   │   └── Entities/
│   │       ├── User.cs                      # System user entity
│   │       ├── OperationClaim.cs            # Permission/role entity
│   │       ├── UserOperationClaim.cs        # User-permission mapping
│   │       ├── RefreshToken.cs              # JWT refresh token
│   │       ├── EmailAuthenticator.cs        # Email 2FA configuration
│   │       └── OtpAuthenticator.cs          # OTP 2FA configuration
│   │
│   ├── Application/                         # Business logic (CQRS)
│   │   ├── Features/                        # Commands (18) & Queries (6)
│   │   │   ├── Auth/                        # 8 commands, 0 queries
│   │   │   │   ├── Commands/
│   │   │   │   │   ├── Login/               # LoginCommand (84 lines)
│   │   │   │   │   ├── Register/            # RegisterCommand (76 lines)
│   │   │   │   │   ├── RefreshToken/        # RefreshTokenCommand (74 lines)
│   │   │   │   │   ├── RevokeToken/         # RevokeTokenCommand
│   │   │   │   │   ├── EnableEmailAuthenticator/
│   │   │   │   │   ├── EnableOtpAuthenticator/
│   │   │   │   │   ├── VerifyEmailAuthenticator/
│   │   │   │   │   └── VerifyOtpAuthenticator/
│   │   │   │   └── Rules/                   # AuthBusinessRules (89 lines)
│   │   │   │
│   │   │   ├── Users/                       # 4 commands, 2 queries
│   │   │   │   ├── Commands/                # Create, Update, Delete, UpdateFromAuth
│   │   │   │   ├── Queries/                 # GetById, GetList
│   │   │   │   └── Rules/                   # UserBusinessRules
│   │   │   │
│   │   │   ├── OperationClaims/             # 3 commands, 2 queries
│   │   │   └── UserOperationClaims/         # 3 commands, 2 queries
│   │   │
│   │   └── Services/                        # Application services
│   │       ├── Repositories/                # 6 repository interfaces
│   │       ├── AuthService/                 # AuthManager (114 lines)
│   │       ├── UsersService/                # UserManager (81 lines)
│   │       ├── AuthenticatorService/        # AuthenticatorManager (127 lines)
│   │       ├── OperationClaims/             # OperationClaimManager (90 lines)
│   │       └── UserOperationClaims/         # UserOperationClaimManager (101 lines)
│   │
│   ├── Persistence/                         # Data access
│   │   ├── Contexts/                        # BaseDbContext
│   │   ├── Repositories/                    # 6 repository implementations
│   │   └── EntityConfigurations/            # 6 EF configurations
│   │
│   ├── Infrastructure/                      # External services
│   │   └── Adapters/
│   │
│   └── WebAPI/                              # API layer
│       ├── Controllers/                     # 5 controllers
│       │   ├── AuthController.cs            # 122 lines, 8 endpoints
│       │   ├── UsersController.cs           # 68 lines, 7 endpoints
│       │   ├── OperationClaimsController.cs # 51 lines, 5 endpoints
│       │   ├── UserOperationClaimsController.cs # 51 lines, 5 endpoints
│       │   └── BaseController.cs            # Base controller with Mediator
│       └── Program.cs                       # 116 lines, application bootstrap
│
└── tests/                                   # Test projects (20 files, 710 LOC)
    └── StarterProject.Application.Tests/
        ├── Features/                        # Feature tests
        │   ├── Auth/Commands/Login/         # LoginTests (146 lines)
        │   └── Users/                       # User CRUD tests
        └── Mocks/                           # Mock repositories and fake data
```

## Entry Points

| File | Lines | Description |
|------|-------|-------------|
| `WebAPI/Program.cs` | 116 | Application bootstrap, DI, JWT config, Swagger, middleware |
| `Application/ApplicationServiceRegistration.cs` | 82 | MediatR, AutoMapper, pipeline behaviors, services |
| `Persistence/PersistenceServiceRegistration.cs` | 27 | DbContext, repositories registration |
| `Infrastructure/InfrastructureServiceRegistration.cs` | - | External services |

## Core Modules

### Core.Application - Pipeline Behaviors

MediatR pipeline behaviors for cross-cutting concerns. Based on [MediatR documentation](https://github.com/jbogard/mediatr).

#### AuthorizationBehavior (Line 10-44)
```csharp
public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ISecuredRequest
```
- `Handle(request, next, cancellationToken)` → Validates user claims and roles
- Throws `AuthorizationException` for unauthorized access
- Admin role bypasses all role checks

#### CachingBehavior (Line 10-118)
```csharp
public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICachableRequest
```
- `Handle(request, next, cancellationToken)` → Cache lookup/store with IDistributedCache
- `getResponseAndAddToCache(...)` → Store response with sliding expiration (Line 51-70)
- `addCacheKeyToGroup(...)` → Group cache keys for bulk invalidation (Line 72-117)

#### CacheRemovingBehavior
```csharp
public class CacheRemovingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICacheRemoverRequest
```
- Invalidates cache groups after commands execute

#### LoggingBehavior
```csharp
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ILoggableRequest
```
- Logs request/response details via Serilog

#### RequestValidationBehavior
```csharp
public class RequestValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
```
- Runs FluentValidation validators before handler
- Throws `ValidationException` on failures

#### TransactionScopeBehavior
```csharp
public class TransactionScopeBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ITransactionalRequest
```
- Wraps handler in TransactionScope

#### PerformanceBehavior
```csharp
public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, IIntervalRequest
```
- Monitors request execution time

### Core.Persistence - Repository Pattern

Based on [Entity Framework Core documentation](https://learn.microsoft.com/en-us/ef/core/).

#### EfRepositoryBase<TEntity, TEntityId, TContext> (464 lines)
Generic repository with soft delete cascade support.

```csharp
public class EfRepositoryBase<TEntity, TEntityId, TContext>
    : IAsyncRepository<TEntity, TEntityId>, IRepository<TEntity, TEntityId>
    where TEntity : Entity<TEntityId>
    where TContext : DbContext
```

**Async Methods:**
| Method | Line | Signature |
|--------|------|-----------|
| `Query` | 25 | `IQueryable<TEntity> Query()` |
| `AddAsync` | 35 | `Task<TEntity> AddAsync(TEntity entity, CancellationToken)` |
| `AddRangeAsync` | 43 | `Task<ICollection<TEntity>> AddRangeAsync(ICollection<TEntity>, CancellationToken)` |
| `UpdateAsync` | 60 | `Task<TEntity> UpdateAsync(TEntity entity, CancellationToken)` |
| `UpdateRangeAsync` | 68 | `Task<ICollection<TEntity>> UpdateRangeAsync(ICollection<TEntity>, CancellationToken)` |
| `DeleteAsync` | 80 | `Task<TEntity> DeleteAsync(TEntity entity, bool permanent, CancellationToken)` |
| `DeleteRangeAsync` | 87 | `Task<ICollection<TEntity>> DeleteRangeAsync(ICollection<TEntity>, bool, CancellationToken)` |
| `GetAsync` | 123 | `Task<TEntity?> GetAsync(Expression<Func<TEntity, bool>>, include?, withDeleted, enableTracking, CancellationToken)` |
| `GetListAsync` | 98 | `Task<IPaginate<TEntity>> GetListAsync(predicate?, orderBy?, include?, index, size, withDeleted, enableTracking, CancellationToken)` |
| `GetListByDynamicAsync` | 141 | `Task<IPaginate<TEntity>> GetListByDynamicAsync(DynamicQuery, predicate?, include?, index, size, ...)` |
| `AnyAsync` | 164 | `Task<bool> AnyAsync(predicate?, include?, withDeleted, CancellationToken)` |

**Soft Delete Support:**
| Method | Line | Description |
|--------|------|-------------|
| `SetEntityAsDeleted` | 304 | Marks entity and cascades to related entities |
| `CheckHasEntityHaveOneToOneRelation` | 347 | Prevents soft delete on 1:1 relations |
| `setEntityAsSoftDeleted` | 380 | Recursive cascade implementation |

### Core.Security - Authentication

Based on JWT bearer tokens and HMACSHA512 hashing.

#### JwtHelper (85 lines)
```csharp
public class JwtHelper : ITokenHelper
```
- `CreateToken(User, IList<OperationClaim>)` → Creates JWT access token
- Uses `SecurityKeyHelper.CreateSecurityKey()` for signing
- Configurable via `TokenOptions` (Issuer, Audience, Expiration)

#### HashingHelper
```csharp
public static class HashingHelper
```
- `CreatePasswordHash(password, out passwordHash, out passwordSalt)` → HMACSHA512
- `VerifyPasswordHash(password, passwordHash, passwordSalt)` → Verification

## Configuration

| File | Purpose |
|------|---------|
| `appsettings.json` | Base configuration |
| `appsettings.Development.json` | Development overrides |
| `appsettings.Staging.json` | Staging overrides |
| `launchSettings.json` | Visual Studio launch profiles |

### Key Configuration Sections

```json
{
  "ConnectionStrings": {
    "BaseDb": "Host=localhost;Port=5432;Database=InfoSYSDb;Username=postgres;Password=postgres"
  },
  "TokenOptions": {
    "AccessTokenExpiration": 480,
    "Audience": "starterProject@kodlama.io",
    "Issuer": "nArchitecture@kodlama.io",
    "RefreshTokenTTL": 2,
    "SecurityKey": "StrongAndSecretKey..."
  },
  "CacheSettings": {
    "SlidingExpiration": 2
  },
  "MailSettings": {
    "Server": "127.0.0.1",
    "Port": 25,
    "SenderEmail": "infosys@kodlama.io"
  },
  "ElasticSearchConfig": {
    "ConnectionString": "http://localhost:9200"
  }
}
```

### Database (PostgreSQL)

```bash
# Docker ile PostgreSQL başlat
docker run --name infosys-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=InfoSYSDb \
  -p 5432:5432 -d postgres:16
```

## Key Dependencies

### Runtime

| Package | Version | Purpose | Docs |
|---------|---------|---------|------|
| Microsoft.EntityFrameworkCore | 10.0.1 | ORM | [Context7](/dotnet/entityframework.docs) |
| MediatR | 14.0.0 | CQRS mediator | [Context7](/jbogard/mediatr) |
| AutoMapper | 16.0.0 | Object mapping | |
| FluentValidation | 12.1.1 | Request validation | [Context7](/fluentvalidation/fluentvalidation) |
| Serilog | 4.3.0 | Structured logging | |
| MailKit | 4.14.1 | Email sending | |
| MimeKit | 4.14.0 | MIME messages | |
| NEST | 7.17.5 | Elasticsearch client | |
| Microsoft.IdentityModel.Tokens | 8.15.0 | JWT handling | |
| System.IdentityModel.Tokens.Jwt | 8.15.0 | JWT creation | |
| Otp.NET | 1.4.1 | OTP generation | |
| Swashbuckle.AspNetCore | 10.0.1 | Swagger/OpenAPI | |
| Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.1 | JWT auth middleware | |
| Microsoft.Extensions.Caching.StackExchangeRedis | 10.0.1 | Redis caching | |
| Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.2 | PostgreSQL provider | |
| System.Linq.Dynamic.Core | 1.7.1 | Dynamic LINQ | |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| xunit.v3 | 3.2.0 | Unit testing |
| Moq | 4.20.72 | Mocking framework |
| coverlet.collector | 6.0.4 | Code coverage |
| Microsoft.NET.Test.Sdk | 18.0.1 | Test SDK |
| Microsoft.EntityFrameworkCore.Tools | 10.0.1 | EF migrations |

## API Endpoints

### AuthController (`/api/Auth`) - 8 endpoints

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| POST | /Login | `LoginCommand` | Authenticate user, return JWT + refresh token |
| POST | /Register | `RegisterCommand` | Register new user |
| GET | /RefreshToken | `RefreshTokenCommand` | Refresh JWT using cookie |
| PUT | /RevokeToken | `RevokeTokenCommand` | Revoke refresh token |
| GET | /EnableEmailAuthenticator | `EnableEmailAuthenticatorCommand` | Enable email 2FA |
| GET | /EnableOtpAuthenticator | `EnableOtpAuthenticatorCommand` | Enable OTP 2FA |
| GET | /VerifyEmailAuthenticator | `VerifyEmailAuthenticatorCommand` | Verify email 2FA code |
| POST | /VerifyOtpAuthenticator | `VerifyOtpAuthenticatorCommand` | Verify OTP code |

### UsersController (`/api/Users`) - 7 endpoints

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| GET | /{Id} | `GetByIdUserQuery` | Get user by ID |
| GET | /GetFromAuth | `GetByIdUserQuery` | Get current authenticated user |
| GET | / | `GetListUserQuery` | List users (paginated) |
| POST | / | `CreateUserCommand` | Create new user |
| PUT | / | `UpdateUserCommand` | Update user |
| PUT | /FromAuth | `UpdateUserFromAuthCommand` | Update current user |
| DELETE | / | `DeleteUserCommand` | Delete user (soft delete) |

### OperationClaimsController (`/api/OperationClaims`) - 5 endpoints

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| GET | /{Id} | `GetByIdOperationClaimQuery` | Get claim by ID |
| GET | / | `GetListOperationClaimQuery` | List claims (paginated) |
| POST | / | `CreateOperationClaimCommand` | Create new claim |
| PUT | / | `UpdateOperationClaimCommand` | Update claim |
| DELETE | / | `DeleteOperationClaimCommand` | Delete claim |

### UserOperationClaimsController (`/api/UserOperationClaims`) - 5 endpoints

| Method | Route | Handler | Description |
|--------|-------|---------|-------------|
| GET | /{Id} | `GetByIdUserOperationClaimQuery` | Get user-claim by ID |
| GET | / | `GetListUserOperationClaimQuery` | List user-claims (paginated) |
| POST | / | `CreateUserOperationClaimCommand` | Assign claim to user |
| PUT | / | `UpdateUserOperationClaimCommand` | Update user-claim |
| DELETE | / | `DeleteUserOperationClaimCommand` | Remove claim from user |

## Database Schema

### Entity Relationships

```
User (1) ←──────→ (*) UserOperationClaim (*) ←──────→ (1) OperationClaim
  │                                                         │
  │                                                         │
  ├── (*) RefreshToken                                      │
  │                                                         │
  ├── (0..1) EmailAuthenticator                            │
  │                                                         │
  └── (0..1) OtpAuthenticator                              │
                                                           │
                                              GeneralOperationClaims.Admin
```

### Entity Fields

| Entity | Key Fields | Timestamps |
|--------|------------|------------|
| `User` | Id (Guid), Email, PasswordHash, PasswordSalt, AuthenticatorType | CreatedDate, UpdatedDate, DeletedDate |
| `OperationClaim` | Id (int), Name | CreatedDate, UpdatedDate, DeletedDate |
| `UserOperationClaim` | Id (Guid), UserId, OperationClaimId | CreatedDate, UpdatedDate, DeletedDate |
| `RefreshToken` | Id (Guid), UserId, Token, Expires, Created, Revoked | CreatedDate, UpdatedDate, DeletedDate |
| `EmailAuthenticator` | Id (Guid), UserId, ActivationKey, IsVerified | CreatedDate, UpdatedDate, DeletedDate |
| `OtpAuthenticator` | Id (Guid), UserId, SecretKey, IsVerified | CreatedDate, UpdatedDate, DeletedDate |

## Quick Start

```bash
# Start PostgreSQL (Docker)
docker run --name infosys-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=InfoSYSDb \
  -p 5432:5432 -d postgres:16

# Restore dependencies
dotnet restore Backend/InfoSYS.sln

# Build solution
dotnet build Backend/InfoSYS.sln

# Run tests
dotnet test Backend/tests/StarterProject.Application.Tests/

# Run API (Development)
dotnet run --project Backend/src/WebAPI/

# Format code
dotnet csharpier Backend/

# Analyze code
dotnet roslynator analyze Backend/InfoSYS.sln

# Create migration
dotnet ef migrations add MigrationName --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/

# Update database
dotnet ef database update --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/
```

### Default URLs
- API: http://localhost:5278
- Swagger UI: http://localhost:5278/swagger

## Project Stats

| Metric | Value |
|--------|-------|
| **Total C# Files** | 259 |
| **Total Lines of Code** | 8,911 |
| Core Package Files | 120 (3,871 LOC) |
| Starter Project Files | 119 (4,330 LOC) |
| Test Files | 20 (710 LOC) |
| **Commands** | 18 |
| **Queries** | 6 |
| **Handlers** | 24 |
| **Controllers** | 5 |
| **API Endpoints** | 25 |
| **Repositories** | 6 |
| **Business Rules** | 4 |
| **Domain Entities** | 6 |
| **Core Projects** | 26 |
| **Pipeline Behaviors** | 7 |

### Largest Files

| File | Lines | Description |
|------|-------|-------------|
| EfRepositoryBase.cs | 464 | Generic EF repository |
| MockRepositoryHelper.cs | 182 | Test utilities |
| IQueryableDynamicFilterExtensions.cs | 174 | Dynamic LINQ |
| ElasticSearchManager.cs | 170 | Elasticsearch client |
| LoginTests.cs | 146 | Auth tests |
| AuthenticatorManager.cs | 127 | 2FA service |
| AuthController.cs | 122 | Auth endpoints |
| CachingBehavior.cs | 118 | Cache pipeline |

## Architecture Patterns

| Pattern | Implementation | Evidence |
|---------|----------------|----------|
| Clean Architecture | 5 layers | Domain, Application, Infrastructure, Persistence, WebAPI |
| CQRS | MediatR 14.0.0 | Separate Command/Query handlers |
| Repository | EfRepositoryBase | IAsyncRepository, IRepository interfaces |
| Pipeline Behaviors | 7 behaviors | Authorization, Caching, Logging, Validation, Transaction, Performance, CacheRemoving |
| Soft Delete | Entity timestamps | DeletedDate with cascade support |
| Dependency Injection | MS.DI | Service registration classes |
| Business Rules | BaseBusinessRules | Feature-specific rule classes |

## Important Notes

### Swagger JWT Authentication (Microsoft.OpenApi 2.x)

Swashbuckle 10.x + Microsoft.OpenApi 2.x kullanıldığında `AddSecurityRequirement` için delegate syntax gereklidir:

```csharp
opt.AddSecurityRequirement(document => new OpenApiSecurityRequirement
{
    [new OpenApiSecuritySchemeReference("Bearer", document)] = []
});
```

> **Not:** Eski syntax `[{}]` (boş) olarak serialize eder ve Swagger UI Authorization header göndermez.

### Token Expiration

JWT access token süresi 8 saat (480 dakika) olarak ayarlanmıştır.

## Context7 Documentation References

For up-to-date documentation on key libraries:

- **MediatR**: `/jbogard/mediatr` - Pipeline behaviors, CQRS patterns
- **EF Core**: `/dotnet/entityframework.docs` - Repository, DbContext, migrations
- **FluentValidation**: `/fluentvalidation/fluentvalidation` - Validation rules, integration

---
*Updated: 2025-12-18 | Auto-generated with /index --ultrathink --seq --c7 command*
