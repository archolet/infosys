# InfoSYS Multi-Solution Yönetim Stratejisi

**Tarih:** 2025-12-18
**Analiz Yöntemi:** 20 adımlık sequential thinking + web araştırması

## Mevcut Durum

### Solution'lar

| Solution | Konum | Proje Sayısı | Amaç |
|----------|-------|--------------|------|
| InfoSYS.sln | Backend/ | 7 | Ana uygulama |
| CorePackages.sln | Backend/Core/ | 26 | Shared framework |

**Not:** Kullanıcı "3 sln" dedi ama 2 var. Frontend ayrı solution'da değil, InfoSYS.sln içinde.

### Bağımlılık Yapısı

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

**Kritik Bulgu:** Core projeleri **NuGet değil ProjectReference** olarak kullanılıyor.
- Avantaj: Anlık değişiklik, kolay debug
- Dezavantaj: 33 proje birden build

## Önerilen Strateji: Pragmatik Monorepo

### Kısa Vadeli (1-2 Hafta)

1. **Solution Filters (.slnf) oluştur:**
   - InfoSYS.Backend.slnf - Sadece backend projeleri
   - InfoSYS.Core.slnf - Sadece Core projeleri
   - InfoSYS.FullStack.slnf - Backend + Frontend

2. **Build scripts oluştur (Makefile):**
   ```makefile
   build-core: dotnet build Backend/Core/CorePackages.sln
   build-backend: dotnet build Backend/InfoSYS.sln
   run-api: dotnet run --project Backend/src/WebAPI/
   run-ui: dotnet run --project Frontend/InfoSYS.WebUI/
   ```

3. **CLAUDE.md güncellemesi** - Multi-solution rehberi ekle

### Orta Vadeli (1-2 Ay)

4. **Directory.Build.props** ile merkezi versiyon yönetimi
5. **Directory.Packages.props** ile central package management
6. **CI/CD path-based triggers:**
   ```yaml
   on:
     push:
       paths:
         - 'Backend/Core/**'
         - 'Backend/src/**'
         - 'Frontend/**'
   ```

### Uzun Vadeli (İhtiyaç Halinde)

7. Frontend.sln oluşturma (ayrı deployment gerekirse)
8. NuGet packages (başka uygulamalar Core kullanacaksa)

## Yapılmaması Gerekenler

- ❌ Git submodules - Karmaşıklık çok yüksek
- ❌ Ayrı repository'ler - Tek ürün için gereksiz
- ❌ Nx/Turborepo - .NET için overkill

## Kaynaklar

- [Monorepo Best Practices](https://monorepo.tools/)
- [.NET Solution Filters](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-sln)
- [Clean Architecture Template](https://github.com/jasontaylordev/CleanArchitecture)
