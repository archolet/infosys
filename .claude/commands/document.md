---
description: "Feature/Component dokümantasyonu - Commands, Queries, Business Rules, API, DTOs"
---

# FEATURE DOCUMENTATION GENERATOR

**Hedef**: $ARGUMENTS

---

## ZORUNLU ADIMLAR

### 1. HEDEF TESPİTİ
Argümanları parse et:
- `[target]`: Feature/Component adı (Auth, Users, vb.)
- `--type`: Dokümantasyon tipi (inline, external, api, guide)
- `--style`: Detay seviyesi (brief, detailed)

### 2. FEATURE KEŞFI

#### Adım 1: Feature Dizini Bul
```
Serena list_dir kullan:
- relative_path: "Backend/src/Application/Features/{target}"
- recursive: true
```

**Beklenen yapı:**
```
Features/{target}/
├── Commands/
│   └── Create/
│       ├── Create{Entity}Command.cs
│       ├── Create{Entity}CommandValidator.cs
│       └── Created{Entity}Response.cs
├── Queries/
│   ├── GetById/
│   └── GetList/
├── Rules/
│   └── {Feature}BusinessRules.cs
├── Constants/
│   ├── {Feature}OperationClaims.cs
│   └── {Feature}Messages.cs
├── Resources/Locales/
└── Profiles/
    └── MappingProfiles.cs
```

#### Adım 2: Commands Analizi
```
Serena find_symbol kullan:
- name_path_pattern: "Command"
- relative_path: "Features/{target}/Commands"
- include_body: true
- depth: 2
```

**Çıktı formatı:**
```markdown
## Commands

### CreateUserCommand
**Description**: Yeni kullanıcı oluşturur

**Properties**:
| Property | Type | Validation |
|----------|------|------------|
| Email | string | Required, Email format |
| Password | string | Required, Min 6 chars |

**Interfaces**:
- `ISecuredRequest` - Roles: Admin, Users.Create
- `ILoggableRequest` - Audit logging

**Handler**: CreateUserCommandHandler
```

#### Adım 3: Queries Analizi
```
Serena find_symbol kullan:
- name_path_pattern: "Query"
- relative_path: "Features/{target}/Queries"
- include_body: true
- depth: 2
```

**Çıktı formatı:**
```markdown
## Queries

### GetListUserQuery
**Description**: Kullanıcı listesi getirir

**Properties**:
| Property | Type | Default |
|----------|------|---------|
| PageRequest | PageRequest | - |

**Interfaces**:
- `ICachableRequest` - CacheKey: Users({page},{size})
- `ISecuredRequest` - Roles: Users.Read
```

#### Adım 4: Business Rules Analizi
```
Serena find_symbol kullan:
- name_path_pattern: "{Feature}BusinessRules"
- include_body: true
- depth: 1
```

**Çıktı formatı:**
```markdown
## Business Rules

### AuthBusinessRules

| Rule Method | Purpose | Exception |
|-------------|---------|-----------|
| UserEmailShouldBeExists | Email kontrolü | BusinessException |
| UserPasswordShouldBeMatch | Şifre doğrulama | BusinessException |
| UserShouldBeActive | Aktiflik kontrolü | BusinessException |

**Dependencies**:
- IUserRepository
- ILocalizationService
```

#### Adım 5: DTOs & Responses
```
Serena find_symbol kullan:
- name_path_pattern: "Response"
- relative_path: "Features/{target}"
- include_body: false
- depth: 1
```

**Çıktı formatı:**
```markdown
## DTOs & Responses

### CreatedUserResponse
| Property | Type |
|----------|------|
| Id | Guid |
| Email | string |
| AccessToken | AccessToken |

### UserListDto
| Property | Type |
|----------|------|
| Id | Guid |
| Email | string |
| Status | bool |
```

#### Adım 6: API Endpoints
```
Serena search_for_pattern kullan:
- pattern: "{target}"
- relative_path: "WebAPI/Controllers"
```

**Çıktı formatı:**
```markdown
## API Endpoints

### {Feature}Controller

| Method | Route | Action | Request | Response |
|--------|-------|--------|---------|----------|
| POST | /api/auth/login | Login | LoginCommand | LoggedResponse |
| POST | /api/auth/register | Register | RegisterCommand | RegisteredResponse |
```

#### Adım 7: Localization Keys
```
Serena read_file kullan:
- relative_path: "Features/{target}/Constants/{Feature}Messages.cs"
```

**Çıktı formatı:**
```markdown
## Localization

### Message Keys
| Key | EN | TR |
|-----|----|----|
| UserDontExists | User not found | Kullanıcı bulunamadı |
| UserMailAlreadyExists | Email exists | Email zaten mevcut |
```

#### Adım 8: Related Entities
```
Serena find_symbol kullan:
- İlgili entity'leri bul
- Relationships çıkar
```

**Çıktı formatı:**
```markdown
## Related Entities

### User
- **Table**: Users
- **Primary Key**: Id (Guid)
- **Relations**:
  - UserOperationClaim (1:N)
  - RefreshToken (1:N)
```

### 3. DOKÜMANTASYON OLUŞTUR

#### External (--type external)
Serena `create_text_file`:
- relative_path: "docs/{feature}.md"
- Tam dokümantasyon dosyası

#### Inline (--type inline)
Kod içi XML documentation:
```csharp
/// <summary>
/// Creates a new user with the specified credentials.
/// </summary>
/// <remarks>
/// Requires Admin or Users.Create role.
/// </remarks>
```

#### API (--type api)
OpenAPI/Swagger formatında:
```yaml
/api/users:
  post:
    summary: Create User
    requestBody:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/CreateUserCommand'
```

#### Guide (--type guide)
Kullanım kılavuzu formatında:
```markdown
# Auth Feature - Kullanım Kılavuzu

## Hızlı Başlangıç
1. Login endpoint'ine POST isteği gönderin
2. Dönen token'ı Authorization header'ına ekleyin
```

### 4. CHECKPOINT
Serena `write_memory`:
- memory_file_name: "{proje}-document-{feature}-final.md"

---

## PARAMETRELER

| Parametre | Açıklama | Değerler |
|-----------|----------|----------|
| `[target]` | Feature adı | Auth, Users, OperationClaims |
| `--type` | Dokümantasyon tipi | inline, external, api, guide |
| `--style` | Detay seviyesi | brief, detailed |

---

## KULLANIM ÖRNEKLERİ

```bash
# Auth feature dokümantasyonu
/document Auth --type external --style detailed

# Users API dokümantasyonu
/document Users --type api

# Kısa özet
/document OperationClaims --style brief

# Inline documentation ekle
/document Auth/Commands/Login --type inline
```

---

## ÇIKTI TİPLERİ

### External (--type external)
`docs/{feature}.md` dosyası oluşturur:
- Feature Overview
- Commands & Queries
- Business Rules
- API Reference
- DTOs
- Examples

### API (--type api)
OpenAPI spec çıktısı:
- Endpoints
- Request/Response schemas
- Authentication requirements

### Guide (--type guide)
Kullanıcı dostu kılavuz:
- Quick Start
- Common Operations
- Error Handling
- Examples

### Inline (--type inline)
Kod içi XML docs:
- Summary
- Remarks
- Params
- Returns
- Exceptions

---

## SERENA MCP TOOL KULLANIMI

| İşlem | Tool | Amaç |
|-------|------|------|
| Dizin tara | `list_dir` | Feature yapısı |
| Sembol bul | `find_symbol` | Commands, Queries |
| Body al | `find_symbol` + include_body | Detaylı analiz |
| Pattern ara | `search_for_pattern` | Endpoint, DTO |
| Dosya oku | `read_file` | Constants, Resources |
| Dosya yaz | `create_text_file` | Dokümantasyon |
| Memory | `write_memory` | Checkpoint |

---

## ÖRNEK ÇIKTI

```markdown
# Auth Feature Documentation

## Overview
Authentication ve authorization işlemlerini yönetir.

## Commands
| Command | Description | Roles |
|---------|-------------|-------|
| LoginCommand | Kullanıcı girişi | - |
| RegisterCommand | Kayıt | - |
| EnableEmailAuthenticatorCommand | Email 2FA | User |

## Queries
| Query | Description | Cache |
|-------|-------------|-------|
| GetByIdUserQuery | Tekil kullanıcı | No |
| GetListUserQuery | Liste | 5 min |

## Business Rules
- UserEmailShouldBeExists
- UserPasswordShouldBeMatch
- UserShouldNotHaveAuthenticator (when enabling)

## API Endpoints
POST /api/auth/login
POST /api/auth/register
GET /api/auth/refresh-token
```

---

**NOT**: Bu komut tek bir feature için odaklı dokümantasyon üretir. Tüm proje için /index kullanın.
