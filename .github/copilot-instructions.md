<!-- Repo-specific Copilot guidance. Keep short and actionable. -->
# Copilot instructions for contributors

This file gives concise, actionable guidance for an AI coding assistant working in this repository.

- **Big picture**: backend is a Clean Architecture/CQRS .NET solution. Reusable framework packages live under `Backend/Core/` and the starter app under `Backend/src/starterProject/` (Domain, Application, Persistence, WebAPI). MediatR is used for commands/queries; EF Core is used via `EfRepositoryBase` abstractions.

- **Where to look first**: `CLAUDE.md` at repo root and `Backend/Core/CLAUDE.md` and `Backend/Core/src/Core.Application/CLAUDE.md` — they contain canonical build commands, architecture diagrams, conventions, and examples used below.

- **Key patterns to follow (exact project conventions)**:
  - Commands/Queries use nested handler classes (e.g. `CreateUserCommand` with inner `CreateUserCommandHandler`). See `Backend/src/starterProject/Application/Features/` for examples.
  - Marker interfaces enable pipeline behaviors: `ISecuredRequest`, `ICachableRequest`, `ICacheRemoverRequest`, `ILoggableRequest`, `ITransactionalRequest`, `IIntervalRequest`. See `Backend/Core/src/Core.Application/Pipelines/`.
  - Business rule classes are `{Feature}BusinessRules` with methods like `UserEmailShouldNotExistsWhenInsert`. See `Application/Features/*/Rules/`.
  - Repository pattern: `I{Entity}Repository` in Application, implementations in `Persistence/Repositories` derive from `EfRepositoryBase<TEntity, TId, BaseDbContext>`.

- **Common developer workflows / commands** (copy-paste):
  - Restore & build solutions: `dotnet restore && dotnet build Backend/*.sln` (e.g. `NArchitecture.sln`, `CorePackages.sln`).
  - Run tests: `dotnet test Backend/tests/StarterProject.Application.Tests/` (filter with `--filter`).
  - Run API locally: `dotnet run --project Backend/src/starterProject/WebAPI/` (defaults to https://localhost:5001).
  - Format code: `dotnet csharpier .`
  - EF migrations (example):
    `dotnet ef migrations add MigrationName --project Backend/src/starterProject/Persistence/ --startup-project Backend/src/starterProject/WebAPI/`

- **What AI should not change without confirmation**:
  - Public pipeline marker interfaces and their semantics (changing `ISecuredRequest` or `ICachableRequest` affects many behaviors).
  - Database schema and migration history; propose migration changes but do not alter existing migrations.
  - Cross-cutting DI registrations in `WebAPI` startup/program — propose patches and ask before applying.

- **Integration points to be mindful of**:
  - JWT auth: token helpers live in `Backend/Core/src/Core.Security/` and configuration is in `appsettings.json` under `TokenOptions`.
  - External services: MailKit (Mailing), NEST (Elasticsearch), Amazon Translate — check `Core` packages for DI wrappers.
  - Caching uses marker properties: `CacheKey`, `CacheGroupKey`, `BypassCache`, `SlidingExpiration` on `ICachableRequest` implementations.

- **Concrete examples to emulate**:
  - A cacheable paged query: `GetListUserQuery` defines `CacheKey` like `Users({PageIndex},{PageSize})` and `CacheGroupKey` = `Users`.
  - Business rule throwing: call repository `AnyAsync` then throw `BusinessException` using localized message (see `UserBusinessRules`).

- **Where to register changes / tests**:
  - Add features under `Backend/src/starterProject/Application/Features/{FeatureName}/` with Commands/Queries/Validators/Rules/Profiles as documented in the repo `CLAUDE.md`.
  - Update DI and AutoMapper profiles in `Backend/src/starterProject/WebAPI/` or the corresponding `DependencyInjection` extension in `Core.*.DependencyInjection` packages.

- **Reference docs**: `PROJECT_INDEX.md` for an indexed code map; `Backend/Core/CLAUDE.md` and `Backend/Core/src/Core.Application/CLAUDE.md` contain authoritative patterns and build commands.

If anything in this summary looks wrong or incomplete, tell me which area to expand (build, pipelines, a specific feature folder, or DI/startup). 
