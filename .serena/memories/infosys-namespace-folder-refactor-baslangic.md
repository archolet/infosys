# InfoSYS Namespace ve Klasör Refactoring - Başlangıç

**Tarih:** 2024-12-17
**Branch:** feature/core-layer-reorganization (devam)

## Görevler

### Görev 1: Namespace Değişikliği
- **Eski:** `NArchitecture.Core.*`
- **Yeni:** `InfoSystem.Core.*`
- **Etkilenen Dosya Sayısı:** 108+ C# dosyası (Core katmanında)
- **Etkilenen Projeler:** Starter Project (using statements)

### Görev 2: Klasör Yapısı Değişikliği
- **Eski:** `Backend/src/starterProject/{Application,Domain,Infrastructure,Persistence,WebAPI}`
- **Yeni:** `Backend/src/{Application,Domain,Infrastructure,Persistence,WebAPI}`
- starterProject klasörü kaldırılacak, içindekiler doğrudan src altına taşınacak

## Mevcut Yapı

```
Backend/
├── Core/src/                    # 26 proje, NArchitecture.Core.* namespace
│   ├── Foundation/
│   ├── Security/
│   ├── CrossCuttingConcerns/
│   ├── Communication/
│   ├── Localization/
│   ├── Translation/
│   ├── Integration/
│   └── Testing/
│
├── src/starterProject/          # Ana uygulama (taşınacak)
│   ├── Application/
│   ├── Domain/
│   ├── Infrastructure/
│   ├── Persistence/
│   └── WebAPI/
│
└── tests/StarterProject.Application.Tests/
```

## Risk Analizi

| Risk | Seviye | Azaltma |
|------|--------|---------|
| Namespace kırılması | Yüksek | Tüm dosyalarda replace |
| using statement eksiklikleri | Orta | Build sonrası kontrol |
| Solution path hataları | Orta | .sln dosyası güncelleme |
| Git history kaybı | Düşük | git mv kullanımı |

## Sıralama

1. ✅ Mevcut durumu analiz et (bu memory)
2. ⏳ Core namespace'lerini değiştir (108+ dosya)
3. ⏳ starterProject'i taşı (git mv)
4. ⏳ Solution ve csproj reference'ları güncelle
5. ⏳ Build ve test
6. ⏳ Final memory
