# InfoSYS Blazor Frontend Projesi - Başlangıç

## Tarih: 2025-12-18

## Mevcut Durum
- Backend: .NET 10 Clean Architecture + CQRS yapısı mevcut
- WebAPI: `/Backend/src/WebAPI/` altında çalışıyor
- Frontend: Henüz yok, oluşturulacak

## Hedef
- Blazor United (Web App) projesi oluşturulacak
- TailwindCSS v4 (son sürüm) entegrasyonu
- Bootstrap OLMAYACAK
- Mevcut Backend API ile entegre çalışacak

## Planlanan Yapı
```
Frontend/
├── InfoSYS.WebUI/          # Ana Blazor Web App projesi
│   ├── Components/         # Blazor bileşenleri
│   ├── Layout/             # Ana layout dosyaları
│   ├── Pages/              # Sayfalar
│   └── wwwroot/            # Static assets, CSS
```

## Teknoloji Kararları
- Blazor Web App (.NET 10) - Interactive render modes desteği
- TailwindCSS v4 - Modern CSS framework
- NO Bootstrap - Temiz başlangıç

## Etkilenecek Dosyalar
- Yeni: Frontend/InfoSYS.WebUI/ (tüm proje)
- Yeni: Solution'a Frontend projesi eklenmesi
