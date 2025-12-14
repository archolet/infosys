---
name: nArchitecture Patterns
version: 1.0
applies_to: "Backend/**/*"
priority: high
---

# nArchitecture Coding Standards

Bu proje **nArchitecture** template'i kullanmaktadır. Aşağıdaki kurallara uyun.

## Clean Architecture Katmanları

```
Backend/
├── Core/                    # NuGet packages (submodule)
└── src/starterProject/
    ├── Domain/              # Entities, Value Objects
    ├── Application/         # Use Cases, Features, Services
    ├── Infrastructure/      # External services adapters
    ├── Persistence/         # Database, Repositories
    └── WebAPI/              # Controllers, Middleware
```

## Dependency Rules

- **Domain** → Hiçbir şeye bağlı değil
- **Application** → Domain'e bağlı
- **Persistence** → Application + Domain'e bağlı
- **Infrastructure** → Application'a bağlı
- **WebAPI** → Hepsine bağlı

## CQRS Pattern

Her feature şu yapıda olmalı:

```
Features/
└── {FeatureName}/
    ├── Commands/
    │   ├── Create/
    │   │   ├── Create{Feature}Command.cs
    │   │   ├── Create{Feature}CommandValidator.cs
    │   │   └── Created{Feature}Response.cs
    │   ├── Update/
    │   └── Delete/
    ├── Queries/
    │   ├── GetById/
    │   │   ├── GetById{Feature}Query.cs
    │   │   └── GetById{Feature}Response.cs
    │   └── GetList/
    ├── Rules/
    │   └── {Feature}BusinessRules.cs
    ├── Profiles/
    │   └── MappingProfiles.cs
    ├── Constants/
    └── Resources/
        └── Locales/
```

## Command/Query Implementation

### Command Örneği

```csharp
public class Create{Feature}Command : IRequest<Created{Feature}Response>, ISecuredRequest
{
    public string[] Roles => new[] { Admin, Write, Create };

    public class Create{Feature}CommandHandler : IRequestHandler<Create{Feature}Command, Created{Feature}Response>
    {
        private readonly I{Feature}Repository _repository;
        private readonly IMapper _mapper;
        private readonly {Feature}BusinessRules _rules;

        public async Task<Created{Feature}Response> Handle(Create{Feature}Command request, CancellationToken cancellationToken)
        {
            // 1. Business rules validation
            await _rules.{Feature}NameShouldNotExist(request.Name);

            // 2. Map and create entity
            var entity = _mapper.Map<{Feature}>(request);

            // 3. Persist
            await _repository.AddAsync(entity);

            // 4. Return response
            return _mapper.Map<Created{Feature}Response>(entity);
        }
    }
}
```

### Query Örneği

```csharp
public class GetList{Feature}Query : IRequest<GetListResponse<GetList{Feature}ListItemDto>>, ICachableRequest
{
    public PageRequest PageRequest { get; set; }

    public string CacheKey => $"GetList{Feature}({PageRequest.PageIndex},{PageRequest.PageSize})";
    public bool BypassCache { get; }
    public TimeSpan? SlidingExpiration { get; }
}
```

## Repository Pattern

```csharp
// Application/Services/Repositories/
public interface I{Feature}Repository : IAsyncRepository<{Feature}, Guid>, IRepository<{Feature}, Guid>
{
    // Custom query methods
}

// Persistence/Repositories/
public class {Feature}Repository : EfRepositoryBase<{Feature}, Guid, BaseDbContext>, I{Feature}Repository
{
}
```

## Business Rules

```csharp
public class {Feature}BusinessRules : BaseBusinessRules
{
    private readonly I{Feature}Repository _repository;
    private readonly ILocalizationService _localizationService;

    public async Task {Feature}ShouldExistWhenSelected({Feature}? entity)
    {
        if (entity == null)
            throw new BusinessException(await _localizationService.GetLocalizedAsync("{Feature}NotFound"));
    }
}
```

## Pipelines (Cross-Cutting Concerns)

| Interface | Amaç |
|-----------|------|
| `ISecuredRequest` | Authorization |
| `ICachableRequest` | Caching |
| `ICacheRemoverRequest` | Cache invalidation |
| `ILoggableRequest` | Logging |
| `ITransactionalRequest` | Transaction |

## Naming Conventions

- Commands: `{Verb}{Feature}Command` (CreateUserCommand)
- Queries: `{Verb}{Feature}Query` (GetListUserQuery)
- Responses: `{Verb}{Feature}Response` (CreatedUserResponse)
- DTOs: `{Feature}Dto`, `{Feature}ListItemDto`
- Validators: `{Command}Validator`
