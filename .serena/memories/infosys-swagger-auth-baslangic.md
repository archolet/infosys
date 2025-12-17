# InfoSYS - Swagger Authorization Problemi - Başlangıç

## Tarih
2025-12-17 23:50

## Problem Tanımı
Swagger UI üzerinden GET /api/Users endpoint'i çağrıldığında 500 Internal Server Error alınıyor.

### Hata Detayı
```
AuthorizationException: You are not authenticated.
at InfoSystem.Core.Application.Pipelines.Authorization.AuthorizationBehavior`2.Handle()
```

### Gözlemler
1. Swagger UI'da Authorize butonu ile Bearer token girildi
2. Ancak curl komutunda Authorization header YOK
3. Token JavaScript ile set edildi ama Swagger request'lerine eklenmedi
4. curl ile doğrudan çağrıda sorun yok - API çalışıyor

### Hedefler
1. Token süresini 10 dakikadan 8 saate çıkart
2. Swagger UI Authorization problemini araştır ve çöz
3. Swagger üzerinden kullanıcıları başarıyla listele

## Etkilenecek Dosyalar
- appsettings.json (TokenOptions.AccessTokenExpiration)
- Swagger configuration (SecurityDefinition/SecurityRequirement)
- Program.cs veya Startup (Swagger setup)

## Analiz Planı
1. TokenOptions konfigürasyonunu bul
2. Swagger security configuration'ı incele
3. Değişiklikleri uygula
4. Test et
