# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands

```bash
# Build (Makefile ile)
make build-all          # Tüm projeleri build et
make build-backend      # Sadece backend (solution filter)
make build-core         # Sadece Core paketleri
make build-frontend     # Sadece frontend

# Build (dotnet CLI ile)
dotnet build Backend/InfoSYS.sln

# Run all tests
make test
# veya
dotnet test Backend/tests/StarterProject.Application.Tests/

# Run specific test
make test-filter F=LoginTests
# veya
dotnet test Backend/tests/StarterProject.Application.Tests/ --filter "FullyQualifiedName~LoginTests"

# Run API (default: http://localhost:5278)
make run-api
# veya
dotnet run --project Backend/src/WebAPI/

# Run Next.js Frontend (default: http://localhost:3000)
make run-nextjs
# veya
cd frontend && npm run dev

# Run Blazor UI (default: http://localhost:5192, https://localhost:7089)
make run-ui
# veya
dotnet run --project Frontend/InfoSYS.WebUI/

# Port Yönetimi (macOS)
make port-status   # veya: make ps  - Port durumunu göster
make kill-api      # veya: make ka  - API portunu serbest bırak
make kill-ui       # veya: make ku  - UI portlarını serbest bırak
make kill-all      # veya: make kall - Tüm portları temizle
make restart-api   # API'yi yeniden başlat (kill + run)
make restart-ui    # UI'ı yeniden başlat (kill + run)

# Format code
make format
# veya
dotnet csharpier Backend/

# EF Core migrations
make db-migrate         # Migration oluştur (interaktif)
make db-update          # Database'i güncelle
# veya
dotnet ef migrations add MigrationName --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/
dotnet ef database update --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/
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
├── Core/                                    # InfoSYS Core packages (26 projects)
│   └── src/
│       ├── Foundation/                      # Temel yapı taşları
│       │   ├── Core.Application/            # Pipeline behaviors, base abstractions
│       │   ├── Core.Persistence/            # EfRepositoryBase, Entity base class
│       │   └── Core.Persistence.WebApi/     # Persistence middleware
│       │
│       ├── Security/                        # Güvenlik
│       │   ├── Core.Security/               # JWT, Hashing, Auth entities
│       │   ├── Core.Security.WebApi.Swagger/# Swagger security
│       │   └── Core.Security.DependencyInjection/
│       │
│       ├── CrossCuttingConcerns/            # Kesişen ilgiler
│       │   ├── Exception/                   # Exception types & middleware
│       │   └── Logging/                     # Serilog implementation
│       │
│       ├── Communication/                   # İletişim
│       │   ├── Mailing/                     # MailKit implementation
│       │   ├── Sms/                         # SMS services
│       │   └── Push/                        # Push notifications
│       │
│       ├── Localization/                    # Lokalizasyon (YAML-based)
│       ├── Integration/                     # External services (ElasticSearch)
│       ├── Translation/                     # Amazon Translate
│       └── Testing/                         # Test utilities
│
└── src/
    ├── Domain/Entities/                     # Entity classes
    ├── Application/
    │   ├── Features/                        # CQRS Commands & Queries
    │   └── Services/Repositories/           # Repository interfaces
    ├── Persistence/Repositories/            # Repository implementations
    └── WebAPI/Controllers/                  # Thin controllers using MediatR
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

### Database (PostgreSQL)

```bash
# Docker ile PostgreSQL başlat
docker run --name infosys-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=InfoSYSDb -p 5432:5432 -d postgres:16

# Connection string (appsettings.Development.json)
"ConnectionStrings": {
  "BaseDb": "Host=localhost;Port=5432;Database=InfoSYSDb;Username=postgres;Password=postgres"
}
```

### Swagger JWT Authentication

Swagger UI'da JWT authentication için:

```csharp
// Program.cs - Swashbuckle 10.x + Microsoft.OpenApi 2.x
builder.Services.AddSwaggerGen(opt =>
{
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });
    
    // CRITICAL: Delegate syntax gerekli (Microsoft.OpenApi 2.x breaking change)
    opt.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document)] = []
    });
});
```

> **Not:** Token süresi 8 saat (480 dakika) olarak ayarlanmıştır.

## Frontend (Next.js - Primary)

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1 |
| React | React 19.2 |
| Language | TypeScript 5 |
| CSS | TailwindCSS v4 |
| Bundler | Turbopack (default) |
| Linting | ESLint 9 + Prettier |

### Project Structure

```
frontend/
├── src/
│   ├── app/                      # App Router (Next.js 16)
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles + TailwindCSS
│   └── components/               # Shared components
├── public/                       # Static assets
├── eslint.config.mjs             # ESLint flat config
├── next.config.ts                # Next.js config
├── postcss.config.mjs            # PostCSS + TailwindCSS v4
├── tailwind.config.ts            # TailwindCSS config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
└── .prettierrc                   # Prettier config
```

### Build & Run Commands

```bash
# Development server (http://localhost:3000)
cd frontend && npm run dev

# Production build
cd frontend && npm run build

# Start production server
cd frontend && npm start

# Lint code
cd frontend && npm run lint

# Format code
cd frontend && npm run format

# Check formatting
cd frontend && npm run format:check
```

### TailwindCSS v4 Notes

TailwindCSS v4 artık `@tailwindcss/postcss` plugin kullanıyor. Ayrı `tailwind.config.js` yerine doğrudan CSS'te import:

```css
/* globals.css */
@import "tailwindcss";
```

Özel tema ayarları için CSS variables kullanılır:
```css
@theme {
  --color-primary: #3b82f6;
  --font-sans: 'Inter', sans-serif;
}
```

---

## Frontend (Blazor Web App - Legacy)

### Tech Stack

| Category | Technology |
|----------|------------|
| Framework | .NET 10 Blazor Web App |
| Render Mode | InteractiveServer (prerender: false) |
| State Management | Fluxor 6.9.0 (Redux pattern) |
| CSS | TailwindCSS v4.1.18 |
| HTTP Client | Typed HttpClient services |

### Project Structure

```
Frontend/InfoSYS.WebUI/
├── Components/
│   ├── App.razor                    # Root component, rendermode config
│   ├── Layout/
│   │   ├── MainLayout.razor         # Authenticated layout
│   │   └── AuthLayout.razor         # Login/Register layout
│   └── Pages/
│       ├── Login.razor              # Login page
│       ├── Dashboard.razor          # Dashboard
│       └── ...
├── Store/Features/                  # Fluxor state management
│   └── Auth/
│       ├── AuthState.cs             # State record
│       ├── AuthActions.cs           # Action records
│       ├── AuthReducers.cs          # Pure reducer functions
│       └── AuthEffects.cs           # Side effects (API calls)
├── Services/
│   ├── Api/                         # Typed HTTP clients
│   │   ├── AuthApiService.cs
│   │   └── UsersApiService.cs
│   └── Storage/                     # Browser storage
│       └── BrowserTokenStorageService.cs
└── Program.cs                       # DI configuration
```

### Fluxor State Management

#### CRITICAL: StoreInitializer Rendermode

**⚠️ StoreInitializer MUTLAKA aynı rendermode ile kullanılmalı!**

```razor
<!-- App.razor - DOĞRU -->
<body>
    <Fluxor.Blazor.Web.StoreInitializer @rendermode="new InteractiveServerRenderMode(prerender: false)" />
    <Routes @rendermode="new InteractiveServerRenderMode(prerender: false)" />
</body>

<!-- YANLIŞ - StoreInitializer rendermode eksik! -->
<body>
    <Fluxor.Blazor.Web.StoreInitializer />  <!-- ❌ Static SSR olarak render edilir -->
    <Routes @rendermode="new InteractiveServerRenderMode(prerender: false)" />
</body>
```

**Neden önemli?**
- StoreInitializer rendermode olmadan kullanılırsa static SSR olarak render edilir
- Routes InteractiveServer modunda çalışırken Fluxor store erişilemez olur
- Dispatcher.Dispatch çalışır ama reducer/effect tetiklenmez

#### State Record Pattern

```csharp
// State record with init properties
[FeatureState]
public record AuthState
{
    public bool IsAuthenticated { get; init; }
    public bool IsLoading { get; init; }
    public bool IsInitialized { get; init; }  // ← MainLayout için kritik!
    public string? AccessToken { get; init; }
    public UserDto? CurrentUser { get; init; }
    public string? ErrorMessage { get; init; }
}
```

#### Reducer Pattern

```csharp
public static class AuthReducers
{
    [ReducerMethod]
    public static AuthState ReduceLoginAction(AuthState state, LoginAction action)
        => state with { IsLoading = true, ErrorMessage = null };

    [ReducerMethod]
    public static AuthState ReduceLoginSuccessAction(AuthState state, LoginSuccessAction action)
        => state with
        {
            IsLoading = false,
            IsInitialized = true,  // ← MUTLAKA set edilmeli!
            IsAuthenticated = true,
            AccessToken = action.AccessToken,
            CurrentUser = action.User,
            ErrorMessage = null
        };
}
```

**⚠️ Reducer'larda `IsInitialized = true` set etmeyi unutmayın!** MainLayout bu değeri kontrol eder.

#### Effect Pattern (Side Effects)

```csharp
public class AuthEffects
{
    private readonly AuthApiService _authApi;
    
    public AuthEffects(AuthApiService authApi) => _authApi = authApi;

    [EffectMethod]
    public async Task HandleLoginAction(LoginAction action, IDispatcher dispatcher)
    {
        var result = await _authApi.LoginAsync(request);
        
        if (!result.IsSuccess)
        {
            dispatcher.Dispatch(new LoginFailureAction(result.ErrorMessage));
            return;
        }
        
        dispatcher.Dispatch(new LoginSuccessAction(result.Data.AccessToken, user));
    }
}
```

### Blazor Form Best Practices

#### InteractiveServer Mode Forms

```razor
@page "/login"
@inherits FluxorComponent
@inject IState<AuthState> AuthState
@inject IDispatcher Dispatcher

<!-- InteractiveServer mode için FormName KULLANMAYIN! -->
<EditForm Model="LoginModel" OnValidSubmit="HandleLogin">
    <DataAnnotationsValidator />
    <InputText @bind-Value="LoginModel.Email" />
    <InputText type="password" @bind-Value="LoginModel.Password" />
    <button type="submit">Giriş Yap</button>
</EditForm>

@code {
    // SupplyParameterFromForm KULLANMAYIN - static SSR için!
    private LoginFormModel LoginModel { get; set; } = new();

    private void HandleLogin()
    {
        Dispatcher.Dispatch(new LoginAction(LoginModel.Email, LoginModel.Password));
    }
}
```

**⚠️ Static SSR vs InteractiveServer Özellikleri:**

| Özellik | Static SSR | InteractiveServer |
|---------|------------|-------------------|
| `FormName` | ✅ Gerekli | ❌ Kullanmayın |
| `SupplyParameterFromForm` | ✅ Gerekli | ❌ Kullanmayın |
| `@rendermode` directive | Opsiyonel | Routes'dan inherit |
| Form action attribute | Otomatik eklenir | Eklenmemeli |
| Antiforgery token | Otomatik eklenir | Gerekmez |

### Common Pitfalls & Solutions

#### 1. Fluxor Store Çalışmıyor

**Belirti:** Dispatcher.Dispatch çağrılıyor ama reducer/effect tetiklenmiyor

**Çözüm:**
```razor
<!-- App.razor'da StoreInitializer'a rendermode ekleyin -->
<Fluxor.Blazor.Web.StoreInitializer @rendermode="new InteractiveServerRenderMode(prerender: false)" />
```

#### 2. Login Sonrası Dashboard Loading'de Takılı

**Belirti:** Login başarılı ama MainLayout loading spinner gösteriyor

**Çözüm:**
```csharp
// AuthReducers.cs - LoginSuccessAction'da IsInitialized = true ekleyin
=> state with { IsInitialized = true, IsAuthenticated = true, ... };
```

#### 3. Form Submit Çalışmıyor

**Belirti:** Submit butonuna tıklanınca hiçbir şey olmuyor

**Çözüm:**
- `FormName` attribute'unu kaldırın
- `SupplyParameterFromForm` attribute'unu kaldırın
- `@rendermode` direktifini kaldırın (Routes'dan inherit edilir)

#### 4. Prerender Tutarsızlığı

**Belirti:** State kaybolması, duplicate render, hydration hataları

**Çözüm:**
```razor
<!-- Tüm component'lerde aynı prerender ayarını kullanın -->
@rendermode="new InteractiveServerRenderMode(prerender: false)"
```

### Build & Run Commands

```bash
# WebUI çalıştır (default: http://localhost:5192)
dotnet run --project Frontend/InfoSYS.WebUI/

# Watch mode ile çalıştır
dotnet watch --project Frontend/InfoSYS.WebUI/

# TailwindCSS build (gerekirse)
cd Frontend/InfoSYS.WebUI && npx tailwindcss -i ./wwwroot/css/app.css -o ./wwwroot/css/app.min.css --watch
```

## Multi-Solution Management

### Solution Yapısı

| Solution | Konum | Proje Sayısı | Amaç | Ne Zaman Aç |
|----------|-------|--------------|------|-------------|
| InfoSYS.sln | Backend/ | 7 | Ana uygulama | Günlük geliştirme |
| CorePackages.sln | Backend/Core/ | 26 | Shared framework | Core değişikliği |

### Solution Filters (.slnf)

IDE performansı için solution filter dosyaları:

```bash
# Sadece backend projeleri aç (hızlı)
Backend/InfoSYS.Backend.slnf

# Full stack (backend + frontend)
Backend/InfoSYS.FullStack.slnf

# Sadece Core foundation projeleri
Backend/Core/CorePackages.Core.slnf
```

### Dependency Chain

```
CorePackages.sln (26 proje)
       ↓ [ProjectReference]
InfoSYS.sln (7 proje)
   ├── Application → Core.Application, Core.Security, Core.Mailing, etc.
   ├── Domain
   ├── Persistence → Core.Persistence
   ├── Infrastructure
   ├── WebAPI
   ├── Tests
   └── Frontend (InfoSYS.WebUI)
```

**Not:** Core projeleri NuGet değil, ProjectReference ile bağlı. Bu sayede:
- Anlık değişiklik testi mümkün
- Debug kolaylığı
- Refactoring IDE desteği

### Hangi Solution'ı Açmalıyım?

| Senaryo | Açılacak Solution/Filter |
|---------|--------------------------|
| Feature geliştirme | InfoSYS.sln veya InfoSYS.Backend.slnf |
| Bug fix | InfoSYS.sln |
| Core değişikliği | CorePackages.sln (Platform team approval gerekir) |
| Frontend-only iş | InfoSYS.FullStack.slnf |
| Hızlı IDE açılışı | InfoSYS.Backend.slnf |

### Build Commands

```bash
# Makefile ile (önerilen)
make build-all          # InfoSYS.sln (transitively Core dahil)
make build-core         # Sadece CorePackages.sln
make build-backend      # InfoSYS.Backend.slnf
make build-frontend     # Sadece WebUI

# dotnet CLI ile
dotnet build Backend/InfoSYS.sln
dotnet build Backend/Core/CorePackages.sln
dotnet build Backend/InfoSYS.Backend.slnf
```

### Code Ownership

```
Backend/Core/     → Platform/Framework takımı
Backend/src/      → Backend takımı
Frontend/         → Frontend takımı
```

Core değişiklikleri için platform team approval gerekir çünkü breaking change riski yüksek.

## Slash Commands

Proje dizininde tanımlı Claude Code slash komutları (`.claude/commands/`):

| Komut | Açıklama | Kullanım |
|-------|----------|----------|
| `/prompt` | Ultra hassas prompt modu - Serena MCP, task parsing, memory checkpointing | `/prompt <görev>` |
| `/index` | Proje indeksi oluşturma - Tech stack, API, Entity schema, Patterns | `/index [target] [--type] [--deep]` |
| `/document` | Feature dokümantasyonu - Commands, Queries, Business Rules, DTOs | `/document [feature] [--type] [--style]` |

### /index Parametreleri

```bash
# Tüm Backend analizi
/index Backend/src --type all

# Sadece API endpoints
/index Backend/src/WebAPI --type api

# Core packages analizi
/index Backend/Core/src --type structure

# Derinlemesine analiz
/index Backend/src/Application/Features/Auth --deep
```

### /document Parametreleri

```bash
# Auth feature dokümantasyonu
/document Auth --type external --style detailed

# Users API dokümantasyonu
/document Users --type api

# Kısa özet
/document OperationClaims --style brief
```

## Additional References

- `PROJECT_INDEX.md` - Detailed code index with line numbers, API endpoints, database schema, and method signatures
- `Makefile` - Build automation komutları (`make help` ile listele)
