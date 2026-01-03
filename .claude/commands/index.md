---
description: "Proje indeksi ve kod analizi - Architecture, API endpoints, Entity schema, Patterns"
---

# PROJECT INDEX GENERATOR

**Hedef**: $ARGUMENTS

---

## ZORUNLU ADIMLAR

### 1. BASLANGIÇ - Memory Kaydet
Serena `write_memory` ile mevcut durumu kaydet:
- memory_file_name: "{proje}-index-baslangic.md"
- content: Hangi modül/dizin analiz edilecek

### 2. ANALİZ ADIMLARI

#### Adım 1: Dizin Yapısı Analizi
```
Serena list_dir kullan:
- relative_path: Hedef dizin
- recursive: true
- skip_ignored_files: true
```

**Çıktı formatı:**
```markdown
## Directory Structure
├── src/
│   ├── Domain/
│   ├── Application/
│   ├── Persistence/
│   └── WebAPI/
```

#### Adım 2: Tech Stack Tespiti
```
Serena search_for_pattern kullan:
- *.csproj dosyalarında PackageReference ara
- appsettings.json'da konfigürasyon tespit et
```

**Çıktı formatı:**
```markdown
## Tech Stack
| Category | Technology | Version |
|----------|------------|---------|
| Framework | .NET | 10.0 |
| ORM | EF Core | 10.0.1 |
```

#### Adım 3: Architecture Pattern Analizi
```
Serena find_symbol kullan:
- IRequest, IRequestHandler ara (CQRS)
- IRepository, EfRepositoryBase ara (Repository)
- Controller, ApiController ara (API Layer)
```

**Çıktı formatı:**
```markdown
## Architecture Patterns
| Pattern | Status | Evidence |
|---------|--------|----------|
| CQRS | Active | MediatR, Commands/Queries |
| Repository | Active | EfRepositoryBase |
| Clean Architecture | Active | Layer separation |
```

#### Adım 4: Entity Schema Çıkarma
```
Serena find_symbol kullan:
- name_path_pattern: "Entity"
- include_kinds: [5] (class)
- depth: 1 (properties dahil)
- relative_path: "Domain/Entities"
```

**Çıktı formatı:**
```markdown
## Entity Schema
### User
| Property | Type | Nullable |
|----------|------|----------|
| Id | Guid | No |
| Email | string | No |
| CreatedDate | DateTime | No |
```

#### Adım 5: API Endpoints Listesi
```
Serena search_for_pattern kullan:
- pattern: "\[Http(Get|Post|Put|Delete|Patch)\]"
- relative_path: "WebAPI/Controllers"
```

**Çıktı formatı:**
```markdown
## API Endpoints
| Method | Route | Controller | Action |
|--------|-------|------------|--------|
| POST | /api/auth/login | AuthController | Login |
| GET | /api/users | UsersController | GetList |
```

#### Adım 6: CQRS Commands & Queries
```
Serena find_symbol kullan:
- name_path_pattern: "Command"
- include_kinds: [5] (class)
- relative_path: "Application/Features"
```

**Çıktı formatı:**
```markdown
## CQRS Operations
### Commands
| Feature | Command | Handler |
|---------|---------|---------|
| Auth | LoginCommand | LoginCommandHandler |

### Queries
| Feature | Query | Handler |
|---------|-------|---------|
| Users | GetListUserQuery | GetListUserQueryHandler |
```

#### Adım 7: Business Rules Analizi
```
Serena find_symbol kullan:
- name_path_pattern: "BusinessRules"
- include_body: false
- depth: 1
```

**Çıktı formatı:**
```markdown
## Business Rules
### AuthBusinessRules
- UserEmailShouldBeExists
- UserPasswordShouldBeMatch
- UserShouldBeActive
```

#### Adım 8: Dependency Graph
```
Serena search_for_pattern kullan:
- pattern: "<ProjectReference Include="
- paths_include_glob: "*.csproj"
```

**Çıktı formatı:**
```markdown
## Project Dependencies
WebAPI
├── Application
├── Persistence
└── Infrastructure

Application
├── Domain
└── Core.Application
```

### 3. INDEX DOSYASI OLUSTUR
Serena `create_text_file` ile PROJECT_INDEX.md oluştur:
- relative_path: "PROJECT_INDEX.md"
- Tüm analiz sonuçlarını birleştir

### 4. CHECKPOINT - Memory Kaydet
Serena `write_memory`:
- memory_file_name: "{proje}-index-final.md"
- content: Oluşturulan index özeti

---

## PARAMETRELER

| Parametre | Açıklama | Örnek |
|-----------|----------|-------|
| `[target]` | Analiz edilecek dizin | `Backend/src`, `Core/src` |
| `--type` | Index tipi | `docs`, `api`, `structure`, `all` |
| `--deep` | Derinlemesine analiz | Symbol bodies dahil |
| `--format` | Çıktı formatı | `md`, `json` |

---

## KULLANIM ÖRNEKLERİ

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

---

## ÇIKTI DOSYASI

Oluşturulan `PROJECT_INDEX.md` şunları içerir:
- **Tech Stack** - Kullanılan teknolojiler ve versiyonlar
- **Architecture Overview** - Mimari yapı ve katmanlar
- **API Endpoints** - Tüm HTTP endpoints
- **Entity Schema** - Database entity'leri
- **CQRS Operations** - Commands ve Queries
- **Business Rules** - İş kuralları
- **Dependencies** - Proje bağımlılıkları
- **Statistics** - Kod metrikleri

---

## SERENA MCP TOOL KULLANIMI

| İşlem | Serena Tool |
|-------|-------------|
| Dizin listele | `list_dir` |
| Sembol bul | `find_symbol` |
| Sembol özeti | `get_symbols_overview` |
| Pattern ara | `search_for_pattern` |
| Dosya oku | `read_file` |
| Dosya yaz | `create_text_file` |
| Memory kaydet | `write_memory` |
| Düşün | `think_about_collected_information` |

---

**NOT**: Bu komut PROJECT_INDEX.md oluşturur. Mevcut dosya varsa üzerine yazılır.
