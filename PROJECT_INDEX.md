# PROJECT_INDEX.md

> **Generated:** 2026-01-02 | **Method:** Serena MCP Symbolic Analysis | **Version:** 2.0

## Overview

InfoSYS is a .NET 10.0 Clean Architecture application implementing CQRS pattern with comprehensive cross-cutting concerns. The project provides authentication, user management, and role-based authorization features.

---

## Project Structure

```
infosys/
├── Backend/
│   ├── Core/                         # 26 reusable Core packages
│   │   └── src/
│   │       ├── Foundation/           # Core.Application, Core.Persistence
│   │       ├── Security/             # JWT, Hashing, Auth entities
│   │       ├── CrossCuttingConcerns/ # Exception, Logging (Serilog)
│   │       ├── Communication/        # Mailing (MailKit), SMS, Push
│   │       ├── Localization/         # YAML-based localization
│   │       ├── Integration/          # ElasticSearch
│   │       ├── Translation/          # Amazon Translate
│   │       └── Testing/              # Test utilities
│   ├── src/
│   │   ├── Domain/                   # Entities (6)
│   │   ├── Application/              # Features, Services, CQRS
│   │   ├── Persistence/              # EF Core, Repositories
│   │   ├── Infrastructure/           # External services
│   │   └── WebAPI/                   # Controllers, Program.cs
│   └── tests/
│       └── StarterProject.Application.Tests/
└── Makefile                          # Build automation
```

---

## Entry Points

| Entry Point | Path | Description |
|-------------|------|-------------|
| **API** | `Backend/src/WebAPI/Program.cs` | ASP.NET Core Web API (http://localhost:5278) |
| **Tests** | `Backend/tests/StarterProject.Application.Tests/` | xUnit test project |

---

## Tech Stack

### Core Packages

| Package | Version | Purpose |
|---------|---------|---------|
| MediatR | 14.0.0 | CQRS mediator pattern |
| FluentValidation | 12.1.1 | Request validation |
| AutoMapper | 16.0.0 | Object mapping |
| Microsoft.EntityFrameworkCore | 10.0.1 | ORM |
| Npgsql.EntityFrameworkCore.PostgreSQL | 10.0.0 | PostgreSQL provider |
| System.IdentityModel.Tokens.Jwt | 8.15.0 | JWT token handling |
| Microsoft.AspNetCore.Authentication.JwtBearer | 10.0.1 | JWT authentication |
| Serilog | 4.3.0 | Structured logging |
| MailKit | 4.14.1 | Email sending |
| Swashbuckle.AspNetCore | 10.0.1 | Swagger/OpenAPI |

### Testing Packages

| Package | Version | Purpose |
|---------|---------|---------|
| xunit.v3 | 3.2.0 | Test framework |
| Moq | 4.20.72 | Mocking framework |
| coverlet.collector | 6.0.4 | Code coverage |

### Integration Packages

| Package | Version | Purpose |
|---------|---------|---------|
| NEST | 7.17.5 | ElasticSearch client |
| AWSSDK.Translate | 4.0.1.9 | Amazon Translate |
| CloudinaryDotNet | 1.27.9 | Image hosting |
| Microsoft.Extensions.Caching.StackExchangeRedis | 10.0.1 | Redis caching |

---

## Core Modules (26 Projects)

### Foundation

| Project | Path | Description |
|---------|------|-------------|
| Core.Application | `Core/src/Foundation/Core.Application/` | Pipeline behaviors, base rules, DTOs |
| Core.Persistence | `Core/src/Foundation/Core.Persistence/` | EfRepositoryBase, Entity base, Paging |
| Core.Persistence.WebApi | `Core/src/Foundation/Core.Persistence.WebApi/` | HTTP context extensions |
| Core.Persistence.DependencyInjection | `Core/src/Foundation/Core.Persistence.DependencyInjection/` | DI registration |

### Security

| Project | Path | Description |
|---------|------|-------------|
| Core.Security | `Core/src/Security/Core.Security/` | JWT, Hashing, Encryption, Auth entities |
| Core.Security.DependencyInjection | `Core/src/Security/Core.Security.DependencyInjection/` | Security DI |
| Core.Security.WebApi.Swagger | `Core/src/Security/Core.Security.WebApi.Swagger/` | Swagger JWT setup |

### Cross-Cutting Concerns

| Project | Path | Description |
|---------|------|-------------|
| Core.CrossCuttingConcerns.Exception | `Core/src/CrossCuttingConcerns/Exception/` | Exception types |
| Core.CrossCuttingConcerns.Exception.WebApi | `Core/src/CrossCuttingConcerns/Exception/Core.CrossCuttingConcerns.Exception.WebAPI/` | Exception middleware |
| Core.CrossCuttingConcerns.Logging | `Core/src/CrossCuttingConcerns/Logging/` | Log DTOs |
| Core.CrossCuttingConcerns.Logging.Serilog | `Core/src/CrossCuttingConcerns/Logging/Core.CrossCuttingConcerns.Logging.SeriLog/` | Serilog implementation |
| Core.CrossCuttingConcerns.Logging.Serilog.File | `Core/src/CrossCuttingConcerns/Logging/Core.CrossCuttingConcerns.Logging.Serilog.File/` | File sink |

### Communication

| Project | Path | Description |
|---------|------|-------------|
| Core.Mailing | `Core/src/Communication/Mailing/Core.Mailing/` | Mail abstractions |
| Core.Mailing.MailKit | `Core/src/Communication/Mailing/Core.Mailing.MailKit/` | MailKit implementation |

### Localization

| Project | Path | Description |
|---------|------|-------------|
| Core.Localization.Abstraction | `Core/src/Localization/Core.Localization.Abstraction/` | ILocalizationService |
| Core.Localization.Resource.Yaml | `Core/src/Localization/Core.Localization.Resource.Yaml/` | YAML resource reader |
| Core.Localization.WebApi | `Core/src/Localization/Core.Localization.WebApi/` | Accept-Language middleware |

### Integration

| Project | Path | Description |
|---------|------|-------------|
| Core.ElasticSearch | `Core/src/Integration/Core.ElasticSearch/` | ElasticSearch manager |

### Translation

| Project | Path | Description |
|---------|------|-------------|
| Core.Translation.Abstraction | `Core/src/Translation/Core.Translation.Abstraction/` | ITranslationService |
| Core.Translation.AmazonTranslate | `Core/src/Translation/Core.Translation.AmazonTranslate/` | Amazon Translate impl |

### Testing

| Project | Path | Description |
|---------|------|-------------|
| Core.Test | `Core/src/Testing/Core.Test/` | BaseMockRepository, FakeData |

---

## Pipeline Behaviors

MediatR pipeline behaviors for cross-cutting concerns:

| Behavior | File | Interface | Purpose |
|----------|------|-----------|---------|
| AuthorizationBehavior | `Core.Application/Pipelines/Authorization/AuthorizationBehavior.cs` | `ISecuredRequest` | Role-based authorization |
| CachingBehavior | `Core.Application/Pipelines/Caching/CachingBehavior.cs` | `ICachableRequest` | Response caching |
| CacheRemovingBehavior | `Core.Application/Pipelines/Caching/CacheRemovingBehavior.cs` | `ICacheRemoverRequest` | Cache invalidation |
| LoggingBehavior | `Core.Application/Pipelines/Logging/LoggingBehavior.cs` | `ILoggableRequest` | Request/response logging |
| RequestValidationBehavior | `Core.Application/Pipelines/Validation/RequestValidationBehavior.cs` | - | FluentValidation execution |
| TransactionScopeBehavior | `Core.Application/Pipelines/Transaction/TransactionScopeBehavior.cs` | `ITransactionalRequest` | Transaction scope |
| PerformanceBehavior | `Core.Application/Pipelines/Performance/PerformanceBehavior.cs` | - | Performance monitoring |

---

## Entity Schema

### Domain Entities

| Entity | Base Class | Key Type | File |
|--------|------------|----------|------|
| User | `Core.Security.Entities.User<Guid>` | `Guid` | `Domain/Entities/User.cs` |
| OperationClaim | `Core.Security.Entities.OperationClaim<int>` | `int` | `Domain/Entities/OperationClaim.cs` |
| UserOperationClaim | `Core.Security.Entities.UserOperationClaim<Guid,Guid,int>` | `Guid` | `Domain/Entities/UserOperationClaim.cs` |
| RefreshToken | `Core.Security.Entities.RefreshToken<Guid,Guid>` | `Guid` | `Domain/Entities/RefreshToken.cs` |
| EmailAuthenticator | `Core.Security.Entities.EmailAuthenticator<Guid>` | `Guid` | `Domain/Entities/EmailAuthenticator.cs` |
| OtpAuthenticator | `Core.Security.Entities.OtpAuthenticator<Guid>` | `Guid` | `Domain/Entities/OtpAuthenticator.cs` |

### Entity Relationships

```
User (1) ──────────── (*) UserOperationClaim (*) ──────────── (1) OperationClaim
  │
  ├──── (*) RefreshToken
  ├──── (*) EmailAuthenticator
  └──── (*) OtpAuthenticator
```

---

## API Endpoints

### AuthController (`/api/Auth`)

| Method | Route | Handler | Auth |
|--------|-------|---------|------|
| POST | `/Login` | `LoginCommand` | - |
| POST | `/Register` | `RegisterCommand` | - |
| GET | `/RefreshToken` | `RefreshTokenCommand` | - |
| PUT | `/RevokeToken` | `RevokeTokenCommand` | ✓ |
| GET | `/EnableEmailAuthenticator` | `EnableEmailAuthenticatorCommand` | ✓ |
| GET | `/EnableOtpAuthenticator` | `EnableOtpAuthenticatorCommand` | ✓ |
| GET | `/VerifyEmailAuthenticator` | `VerifyEmailAuthenticatorCommand` | - |
| POST | `/VerifyOtpAuthenticator` | `VerifyOtpAuthenticatorCommand` | ✓ |

### UsersController (`/api/Users`)

| Method | Route | Handler | Auth |
|--------|-------|---------|------|
| GET | `/{Id}` | `GetByIdUserQuery` | ✓ |
| GET | `/GetFromAuth` | `GetByIdUserQuery` (from token) | ✓ |
| GET | `/` | `GetListUserQuery` | ✓ |
| POST | `/` | `CreateUserCommand` | ✓ |
| PUT | `/` | `UpdateUserCommand` | ✓ |
| PUT | `/FromAuth` | `UpdateUserFromAuthCommand` | ✓ |
| DELETE | `/` | `DeleteUserCommand` | ✓ |

### OperationClaimsController (`/api/OperationClaims`)

| Method | Route | Handler | Auth |
|--------|-------|---------|------|
| GET | `/{Id}` | `GetByIdOperationClaimQuery` | ✓ |
| GET | `/` | `GetListOperationClaimQuery` | ✓ |
| POST | `/` | `CreateOperationClaimCommand` | ✓ |
| PUT | `/` | `UpdateOperationClaimCommand` | ✓ |
| DELETE | `/` | `DeleteOperationClaimCommand` | ✓ |

### UserOperationClaimsController (`/api/UserOperationClaims`)

| Method | Route | Handler | Auth |
|--------|-------|---------|------|
| GET | `/{Id}` | `GetByIdUserOperationClaimQuery` | ✓ |
| GET | `/` | `GetListUserOperationClaimQuery` | ✓ |
| POST | `/` | `CreateUserOperationClaimCommand` | ✓ |
| PUT | `/` | `UpdateUserOperationClaimCommand` | ✓ |
| DELETE | `/` | `DeleteUserOperationClaimCommand` | ✓ |

**Total: 25 endpoints** across 4 controllers

---

## CQRS Operations

### Commands (18)

| Feature | Command | File | Interfaces |
|---------|---------|------|------------|
| **Auth** | LoginCommand | `Features/Auth/Commands/Login/LoginCommand.cs` | IRequest |
| | RegisterCommand | `Features/Auth/Commands/Register/RegisterCommand.cs` | IRequest |
| | RefreshTokenCommand | `Features/Auth/Commands/RefreshToken/RefreshTokenCommand.cs` | IRequest |
| | RevokeTokenCommand | `Features/Auth/Commands/RevokeToken/RevokeTokenCommand.cs` | IRequest, ISecuredRequest |
| | EnableEmailAuthenticatorCommand | `Features/Auth/Commands/EnableEmailAuthenticator/` | IRequest, ISecuredRequest |
| | EnableOtpAuthenticatorCommand | `Features/Auth/Commands/EnableOtpAuthenticator/` | IRequest, ISecuredRequest |
| | VerifyEmailAuthenticatorCommand | `Features/Auth/Commands/VerifyEmailAuthenticator/` | IRequest |
| | VerifyOtpAuthenticatorCommand | `Features/Auth/Commands/VerifyOtpAuthenticator/` | IRequest, ISecuredRequest |
| **Users** | CreateUserCommand | `Features/Users/Commands/Create/CreateUserCommand.cs` | IRequest, ISecuredRequest |
| | UpdateUserCommand | `Features/Users/Commands/Update/UpdateUserCommand.cs` | IRequest, ISecuredRequest |
| | UpdateUserFromAuthCommand | `Features/Users/Commands/UpdateFromAuth/` | IRequest |
| | DeleteUserCommand | `Features/Users/Commands/Delete/DeleteUserCommand.cs` | IRequest, ISecuredRequest |
| **OperationClaims** | CreateOperationClaimCommand | `Features/OperationClaims/Commands/Create/` | IRequest, ISecuredRequest |
| | UpdateOperationClaimCommand | `Features/OperationClaims/Commands/Update/` | IRequest, ISecuredRequest |
| | DeleteOperationClaimCommand | `Features/OperationClaims/Commands/Delete/` | IRequest, ISecuredRequest |
| **UserOperationClaims** | CreateUserOperationClaimCommand | `Features/UserOperationClaims/Commands/Create/` | IRequest, ISecuredRequest |
| | UpdateUserOperationClaimCommand | `Features/UserOperationClaims/Commands/Update/` | IRequest, ISecuredRequest |
| | DeleteUserOperationClaimCommand | `Features/UserOperationClaims/Commands/Delete/` | IRequest, ISecuredRequest |

### Queries (6)

| Feature | Query | File | Interfaces |
|---------|-------|------|------------|
| **Users** | GetByIdUserQuery | `Features/Users/Queries/GetById/GetByIdUserQuery.cs` | IRequest, ISecuredRequest |
| | GetListUserQuery | `Features/Users/Queries/GetList/GetListUserQuery.cs` | IRequest, ISecuredRequest |
| **OperationClaims** | GetByIdOperationClaimQuery | `Features/OperationClaims/Queries/GetById/` | IRequest, ISecuredRequest |
| | GetListOperationClaimQuery | `Features/OperationClaims/Queries/GetList/` | IRequest, ISecuredRequest |
| **UserOperationClaims** | GetByIdUserOperationClaimQuery | `Features/UserOperationClaims/Queries/GetById/` | IRequest, ISecuredRequest |
| | GetListUserOperationClaimQuery | `Features/UserOperationClaims/Queries/GetList/` | IRequest, ISecuredRequest |

---

## Business Rules

| Class | File | Purpose |
|-------|------|---------|
| AuthBusinessRules | `Features/Auth/Rules/AuthBusinessRules.cs` | Login validation, token checks |
| UserBusinessRules | `Features/Users/Rules/UserBusinessRules.cs` | Email uniqueness, user existence |
| OperationClaimBusinessRules | `Features/OperationClaims/Rules/OperationClaimBusinessRules.cs` | Claim validation |
| UserOperationClaimBusinessRules | `Features/UserOperationClaims/Rules/UserOperationClaimBusinessRules.cs` | Assignment validation |

---

## Repository Interfaces

| Interface | Entity | Key Type | File |
|-----------|--------|----------|------|
| IUserRepository | User | Guid | `Services/Repositories/IUserRepository.cs` |
| IOperationClaimRepository | OperationClaim | int | `Services/Repositories/IOperationClaimRepository.cs` |
| IUserOperationClaimRepository | UserOperationClaim | Guid | `Services/Repositories/IUserOperationClaimRepository.cs` |
| IRefreshTokenRepository | RefreshToken | Guid | `Services/Repositories/IRefreshTokenRepository.cs` |
| IEmailAuthenticatorRepository | EmailAuthenticator | Guid | `Services/Repositories/IEmailAuthenticatorRepository.cs` |
| IOtpAuthenticatorRepository | OtpAuthenticator | Guid | `Services/Repositories/IOtpAuthenticatorRepository.cs` |

---

## Database Configuration

### PostgreSQL Connection

```json
{
  "ConnectionStrings": {
    "BaseDb": "Host=localhost;Port=5432;Database=InfoSYSDb;Username=postgres;Password=postgres"
  }
}
```

### Docker Setup

```bash
docker run --name infosys-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=InfoSYSDb \
  -p 5432:5432 \
  -d postgres:16
```

### EF Core Migrations

```bash
# Add migration
dotnet ef migrations add MigrationName \
  --project Backend/src/Persistence/ \
  --startup-project Backend/src/WebAPI/

# Update database
dotnet ef database update \
  --project Backend/src/Persistence/ \
  --startup-project Backend/src/WebAPI/
```

---

## Project Dependencies

### Main Application

```
WebAPI
├── Application
│   ├── Domain
│   │   ├── Core.Persistence
│   │   └── Core.Security
│   ├── Core.Application
│   ├── Core.Mailing + Core.Mailing.MailKit
│   ├── Core.CrossCuttingConcerns.Exception
│   ├── Core.CrossCuttingConcerns.Logging.Serilog.File
│   ├── Core.Localization.Abstraction
│   ├── Core.Localization.Resource.Yaml.DependencyInjection
│   ├── Core.ElasticSearch
│   └── Core.Security.DependencyInjection
├── Persistence
│   ├── Application
│   ├── Core.Persistence
│   └── Core.Persistence.DependencyInjection
├── Infrastructure
│   └── Application
├── Core.CrossCuttingConcerns.Exception.WebApi
├── Core.Localization.WebApi
├── Core.Persistence.WebApi
└── Core.Security.WebApi.Swagger
```

### Core Package Dependencies

```
Core.Application
├── Core.CrossCuttingConcerns.Logging.Abstraction
├── Core.CrossCuttingConcerns.Logging
├── Core.CrossCuttingConcerns.Exception
└── Core.Security

Core.Security
└── Core.Persistence

Core.CrossCuttingConcerns.Exception.WebApi
├── Core.CrossCuttingConcerns.Logging.Abstraction
├── Core.CrossCuttingConcerns.Logging
└── Core.CrossCuttingConcerns.Exception
```

---

## Quick Start

### Prerequisites

- .NET 10.0 SDK
- Docker (for PostgreSQL)
- Node.js (for frontend, if applicable)

### Run Backend

```bash
# Start PostgreSQL
docker run --name infosys-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=InfoSYSDb -p 5432:5432 -d postgres:16

# Run migrations
dotnet ef database update --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/

# Start API
make run-api
# or
dotnet run --project Backend/src/WebAPI/
```

### API Access

- **Base URL:** http://localhost:5278
- **Swagger:** http://localhost:5278/swagger
- **JWT Token Duration:** 8 hours (480 minutes)

---

## Code Statistics

| Metric | Value |
|--------|-------|
| Total C# Files | 366 |
| Total Lines of Code | ~11,438 |
| Core Packages | 26 |
| Main Projects | 5 (Domain, Application, Persistence, Infrastructure, WebAPI) |
| Entity Classes | 6 |
| API Endpoints | 25 |
| CQRS Commands | 18 |
| CQRS Queries | 6 |
| Business Rule Classes | 4 |
| Repository Interfaces | 6 |
| Pipeline Behaviors | 7 |

---

## Architecture Patterns

### Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│                  WebAPI                      │  ← Presentation
├─────────────────────────────────────────────┤
│               Application                    │  ← Use Cases (CQRS)
├─────────────────────────────────────────────┤
│          Persistence / Infrastructure        │  ← Interface Adapters
├─────────────────────────────────────────────┤
│                  Domain                      │  ← Entities
└─────────────────────────────────────────────┘
```

### CQRS Flow

```
Request → Controller → MediatR → Pipeline Behaviors → Handler → Repository → Database
                                      │
                                      ├── AuthorizationBehavior
                                      ├── ValidationBehavior
                                      ├── CachingBehavior
                                      ├── LoggingBehavior
                                      └── TransactionBehavior
```

### Repository Pattern

```csharp
// Interface (Application layer)
public interface IUserRepository : IAsyncRepository<User, Guid>, IRepository<User, Guid> { }

// Implementation (Persistence layer)
public class UserRepository : EfRepositoryBase<User, Guid, BaseDbContext>, IUserRepository { }
```

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-02 | Deep regeneration with Serena MCP symbolic analysis |
| 2025-12-18 | Initial PROJECT_INDEX.md creation |
| 2025-12-17 | PostgreSQL support added |
| 2025-12-16 | Namespace rename to InfoSystem.Core |
