# Core.Application Package

NArchitecture framework'unun temel Application katmani. CQRS pattern'i icin MediatR pipeline behavior'larini ve base abstraction'lari icerir.

## Tech Stack

| Category | Technology |
|----------|------------|
| Language | C# 13 |
| Framework | .NET 10.0 |
| Mediator | MediatR 14.0.0 |
| Validation | FluentValidation 12.1.1 |
| Caching | Microsoft.Extensions.Caching.Abstractions 10.0.1 |

## Project Structure

```
Core.Application/
├── Pipelines/
│   ├── Authorization/
│   │   ├── AuthorizationBehavior.cs    # Role-based auth
│   │   └── ISecuredRequest.cs          # Marker interface
│   ├── Caching/
│   │   ├── CachingBehavior.cs          # Response caching
│   │   ├── CacheRemovingBehavior.cs    # Cache invalidation
│   │   ├── ICachableRequest.cs         # Marker interface
│   │   ├── ICacheRemoverRequest.cs     # Marker interface
│   │   └── CacheSettings.cs            # Config model
│   ├── Logging/
│   │   ├── LoggingBehavior.cs          # Request/response logging
│   │   └── ILoggableRequest.cs         # Marker interface
│   ├── Performance/
│   │   ├── PerformanceBehavior.cs      # Performance monitoring
│   │   └── IIntervalRequest.cs         # Marker interface
│   ├── Transaction/
│   │   ├── TransactionScopeBehavior.cs # Transaction scope
│   │   └── ITransactionalRequest.cs    # Marker interface
│   └── Validation/
│       ├── RequestValidationBehavior.cs # FluentValidation
│       └── ValidationTool.cs            # Validation helper
├── Dtos/
│   ├── IDto.cs                          # Base DTO interface
│   ├── UserForLoginDto.cs               # Login DTO
│   └── UserForRegisterDto.cs            # Register DTO
├── Requests/
│   └── PageRequest.cs                   # Pagination request
├── Responses/
│   ├── IResponse.cs                     # Base response interface
│   └── GetListResponse.cs               # Paginated list response
└── Rules/
    └── BaseBusinessRules.cs             # Business rules base class
```

## Pipeline Behaviors

| Behavior | Marker Interface | Purpose |
|----------|------------------|---------|
| `AuthorizationBehavior` | `ISecuredRequest` | Role-based authorization |
| `CachingBehavior` | `ICachableRequest` | Response caching (Redis) |
| `CacheRemovingBehavior` | `ICacheRemoverRequest` | Cache invalidation |
| `LoggingBehavior` | `ILoggableRequest` | Request/response logging |
| `RequestValidationBehavior` | `IValidator<TRequest>` | FluentValidation |
| `TransactionScopeBehavior` | `ITransactionalRequest` | Transaction scope |
| `PerformanceBehavior` | `IIntervalRequest` | Performance monitoring |

## Usage Examples

### Secured Command
```csharp
public class CreateUserCommand : IRequest<CreatedUserResponse>, ISecuredRequest
{
    public string[] Roles => new[] { "Admin", "Users.Create" };
    // ...
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

### Cache Remover Command
```csharp
public class UpdateUserCommand : IRequest<UpdatedUserResponse>, ICacheRemoverRequest
{
    public bool BypassCache => false;
    public string? CacheKey => null;
    public string[]? CacheGroupKey => new[] { "Users" };
}
```

### Logged Request
```csharp
public class CreateUserCommand : IRequest<CreatedUserResponse>, ILoggableRequest
{
    // Request will be logged automatically
}
```

### Transactional Command
```csharp
public class TransferFundsCommand : IRequest<TransferResult>, ITransactionalRequest
{
    // Entire operation wrapped in TransactionScope
}
```

## Dependencies

```
Core.Application
├── Core.Security
├── Core.CrossCuttingConcerns.Logging
├── Core.CrossCuttingConcerns.Logging.Abstraction
└── Core.CrossCuttingConcerns.Exception
```

## Build Commands

```bash
# Build
dotnet build Core.Application.csproj

# Format
dotnet csharpier .
```

## Statistics

| Metric | Value |
|--------|-------|
| C# Files | 22 |
| Lines of Code | 519 |
| Pipeline Behaviors | 7 |
| Marker Interfaces | 6 |
| Last Indexed | 2025-12-14 |
