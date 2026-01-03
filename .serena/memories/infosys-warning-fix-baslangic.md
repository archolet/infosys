# InfoSYS Warning Düzeltme - Başlangıç

**Tarih:** 2025-12-18
**Görev:** `make fa` çalıştırıldığında çıkan warning'leri analiz et ve düzelt

---

## Bilinen Warning'ler (Önceki Çalışmadan)

1. **NU1510 Warning** - PackageReference System.Text.Encodings.Web gereksiz
   - `Core.Localization.WebApi.csproj`
   - `Core.Persistence.WebApi.csproj`

2. **CS8602 Warning** - Possible null reference dereference
   - `IQueryableDynamicFilterExtensions.cs` (satır 32)

---

## Plan

1. `make fa` çalıştır ve tüm warning'leri topla
2. Warning türlerini kategorize et
3. Her warning için düzeltme yap
4. Test et
