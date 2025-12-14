# NArchitecture Core Packages - Project Rules

**Auto-Generated:** 2025-12-14T23:35:00Z
**Analiz Edilen:** 198 C# dosyası, 4,767 satır kod, 26 proje

---

## Bu Proje Hakkında

Bu dizin nArchitecture framework'ünün **core paketlerini** içerir. Bu paketler diğer projeler tarafından referans edilir ve değişiklikler tüm bağımlı projeleri etkiler.

---

## Naming Conventions (Tespit Edilen)

### Interface Pattern
```csharp
public interface ITokenHelper<TUserId, TOperationClaimId, TRefreshTokenId>
public interface IOtpAuthenticatorHelper
public interface IEmailAuthenticatorHelper
public interface IMailService
public interface IAsyncRepository<TEntity, TEntityId>
```
**Kural:** Interface'ler `I{Name}` formatında, generic olanlar `I{Name}<TParam1, TParam2>` şeklinde

### Class Pattern
```csharp
public class EfRepositoryBase<TEntity, TEntityId, TContext>
public abstract class Entity<TId>
public class TransactionScopeBehavior<TRequest, TResponse>
```
**Kural:** Base/abstract class'lar `{Name}Base<T>` veya `{Name}<T>` formatında

### Pipeline Behavior Pattern
```csharp
public class {Name}Behavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
```
**Kural:** Tüm behavior'lar `{Feature}Behavior<TRequest, TResponse>` formatında

---

## Namespace Convention

Root namespace: `NArchitecture.Core`

```csharp
namespace NArchitecture.Core.Application.Pipelines.{Feature};
namespace NArchitecture.Core.Persistence.Repositories;
namespace NArchitecture.Core.Security.{Module};
namespace NArchitecture.Core.CrossCuttingConcerns.{Concern};
namespace NArchitecture.Core.{Module};
```

**Kural:** Her package kendi namespace'ini kullanır, hepsi `NArchitecture.Core.` ile başlar

---

## Dependency Rules (Bu Projede)

### Proje Referans Hiyerarşisi
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

Core.Localization.Resource.Yaml
└── Core.Localization.Abstraction

Core.Translation.AmazonTranslate
└── Core.Translation.Abstraction
```

**Kurallar:**
1. ❌ Core.Persistence başka Core paketine referans VEREMEZ (en alt katman)
2. ❌ Abstraction paketleri implementation paketlerine referans VEREMEZ
3. ❌ Circular dependency YASAK
4. ✅ Implementation paketleri sadece kendi Abstraction'larına referans verebilir

---

## Code Patterns (Bu Projede Kullanılan)

### 1. Repository Pattern
```csharp
// Interface
public interface IAsyncRepository<TEntity, TEntityId> : IQuery<TEntity>
public interface IRepository<TEntity, TEntityId>

// Implementation
public class EfRepositoryBase<TEntity, TEntityId, TContext>
    where TEntity : Entity<TEntityId>
    where TContext : DbContext
```

### 2. Entity Pattern
```csharp
public abstract class Entity<TId> : IEntity<TId>, IEntityTimestamps
{
    public TId Id { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public DateTime? DeletedDate { get; set; }
}
```

### 3. Pipeline Behavior Pattern (7 adet tespit edildi)
| Behavior | Interface | Purpose |
|----------|-----------|---------|
| `AuthorizationBehavior` | `ISecuredRequest` | Role-based authorization |
| `CachingBehavior` | `ICachableRequest` | Response caching |
| `CacheRemovingBehavior` | `ICacheRemoverRequest` | Cache invalidation |
| `LoggingBehavior` | `ILoggableRequest` | Request/response logging |
| `RequestValidationBehavior` | `IValidator<TRequest>` | FluentValidation |
| `TransactionScopeBehavior` | `ITransactionalRequest` | Transaction scope |
| `PerformanceBehavior` | `IIntervalRequest` | Performance monitoring |

### 4. Exception Pattern
```csharp
public class BusinessException : System.Exception
public class NotFoundException : System.Exception
public class ValidationException : System.Exception
public class AuthorizationException : System.Exception
```

### 5. DI Registration Pattern
```csharp
public static IServiceCollection Add{Feature}(this IServiceCollection services)
{
    services.AddScoped<I{Feature}, {Feature}Implementation>();
    return services;
}
```

---

## Dosya Oluşturma Kuralları

### Yeni Interface Eklerken
1. Interface'i uygun `Abstraction` paketine koy
2. `I` prefix'i kullan
3. Namespace: `NArchitecture.Core.{Module}`

### Yeni Behavior Eklerken
1. `Core.Application/Pipelines/{Feature}/` altına koy
2. `{Feature}Behavior<TRequest, TResponse>` formatında isimlendir
3. İlgili marker interface'i tanımla (örn: `I{Feature}Request`)

### Yeni Entity Eklerken
1. `Entity<TId>` base class'ından türet
2. Audit field'ları (`CreatedDate`, `UpdatedDate`, `DeletedDate`) otomatik gelir
3. Generic Id tipi kullan

---

## Anti-Patterns (YAPMA!)

1. ❌ Core.Persistence içinde business logic yazma
2. ❌ Abstraction paketlerinde implementation kodu ekleme
3. ❌ Exception class'larına iş mantığı koyma
4. ❌ Pipeline behavior'larda heavy operation yapma
5. ❌ Entity class'larına method ekleme (anemic domain model)
6. ❌ Static helper'lar yerine DI kullanılabilir sınıflar kullanmamak

---

## Test Kuralları

- Test projesi: `Core.Test`
- Test framework: xUnit
- Mocking: Moq 4.20.72
- InMemory DB: `Microsoft.EntityFrameworkCore.InMemory`

---

## Build ve Format

```bash
# Build
dotnet build CorePackages.sln

# Format
dotnet csharpier .

# Test
dotnet test src/Core.Test/Core.Test.csproj
```

---

## Notes

- Bu dosya `/x:index --deep` tarafından otomatik üretildi
- Proje analiz edilerek gerçek kod pattern'leri çıkarıldı
- Şablon kopyalama YAPILMADI - tüm kurallar bu projedeki koddan türetildi
