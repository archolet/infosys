# Core.Application - Project Rules

**Auto-Generated:** 2025-12-14T23:41:50Z
**Analiz Edilen:** 22 C# dosyasi, 519 satir kod

---

## Bu Proje Hakkinda

Bu paket nArchitecture framework'unun Application katmanini icerir. MediatR pipeline behavior'lari ve CQRS pattern'i icin temel abstraction'lari saglar.

---

## Naming Conventions (Tespit Edilen)

### Interface Pattern
```csharp
public interface ISecuredRequest
public interface ICachableRequest
public interface ICacheRemoverRequest
public interface ILoggableRequest
public interface ITransactionalRequest
public interface IIntervalRequest
public interface IDto
public interface IResponse
```
**Kural:** Marker interface'ler `I{Feature}Request` formatinda. Base interface'ler `I{Name}` formatinda.

### Behavior Pattern
```csharp
public class AuthorizationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ISecuredRequest

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ICachableRequest
```
**Kural:** Behavior class'lari `{Feature}Behavior<TRequest, TResponse>` formatinda. Generic constraint olarak ilgili marker interface'i kullanir.

### DTO Pattern
```csharp
public class UserForLoginDto : IDto
public class UserForRegisterDto : IDto
```
**Kural:** DTO class'lari `{Entity}For{Action}Dto` formatinda ve `IDto` interface'ini implement eder.

### Response Pattern
```csharp
public class GetListResponse<T> : BasePageableModel
```
**Kural:** Generic response class'lari `{Action}Response<T>` formatinda.

---

## Namespace Convention

Root namespace: `NArchitecture.Core.Application`

```csharp
namespace NArchitecture.Core.Application.Pipelines.{Feature};
namespace NArchitecture.Core.Application.Dtos;
namespace NArchitecture.Core.Application.Requests;
namespace NArchitecture.Core.Application.Responses;
namespace NArchitecture.Core.Application.Rules;
```

---

## Pipeline Behavior Yazim Kurallari

### 1. Marker Interface Olusturma
```csharp
namespace NArchitecture.Core.Application.Pipelines.{Feature};

public interface I{Feature}Request
{
    // Feature-specific properties
}
```

### 2. Behavior Olusturma
```csharp
namespace NArchitecture.Core.Application.Pipelines.{Feature};

public class {Feature}Behavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, I{Feature}Request
{
    // Dependencies via constructor injection

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken
    )
    {
        // Pre-processing
        TResponse response = await next();
        // Post-processing
        return response;
    }
}
```

### 3. Klasor Yapisi
```
Pipelines/
└── {Feature}/
    ├── {Feature}Behavior.cs
    └── I{Feature}Request.cs
```

---

## Dependency Rules

### Proje Referanslari
```
Core.Application
├── Core.Security (Auth islemleri icin)
├── Core.CrossCuttingConcerns.Logging (Logging icin)
├── Core.CrossCuttingConcerns.Logging.Abstraction
└── Core.CrossCuttingConcerns.Exception (Exception types)
```

**Kurallar:**
1. Core.Application sadece diger Core.* paketlerine referans verebilir
2. Starter Project veya diger uygulamalar Core.Application'a referans verir
3. Circular dependency YASAK

---

## Code Patterns (Bu Projede Kullanilan)

### 1. Constructor Injection
```csharp
public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;

    public CachingBehavior(IDistributedCache cache, ILogger<...> logger, IConfiguration configuration)
    {
        _cache = cache;
        _logger = logger;
    }
}
```

### 2. Exception Throwing Pattern
```csharp
if (!_httpContextAccessor.HttpContext.User.Claims.Any())
    throw new AuthorizationException("You are not authenticated.");
```

### 3. Async/Await Pattern
```csharp
public async Task<TResponse> Handle(...)
{
    TResponse response = await next();
    return response;
}
```

---

## Dosya Olusturma Kurallari

### Yeni Behavior Eklerken
1. `Pipelines/{Feature}/` klasoru olustur
2. `I{Feature}Request.cs` marker interface'i olustur
3. `{Feature}Behavior.cs` behavior class'i olustur
4. Generic constraint olarak marker interface'i kullan

### Yeni DTO Eklerken
1. `Dtos/` klasorune ekle
2. `{Entity}For{Action}Dto` formatinda isimlendir
3. `IDto` interface'ini implement et

---

## Anti-Patterns (YAPMA!)

1. Behavior icinde heavy computation YAPMA (async pattern kullan)
2. Marker interface'e gereksiz property ekleme
3. Behavior'lar arasi bagimlilik olusturma
4. Exception yerine null return etme
5. Hardcoded string kullanma (localization kullan)
6. Static class/method kullanma (DI kullan)

---

## Test Kurallari

- Unit test'ler behavior'lari mocklayarak test eder
- Integration test'ler full pipeline'i test eder
- Mock framework: Moq

---

## Notes

- Bu dosya /x:index tarafından otomatik uretildi
- Proje analiz edilerek gercek kod pattern'leri cikarildi
- Sablon kopyalama YAPILMADI - tum kurallar bu projedeki koddan turetildi
