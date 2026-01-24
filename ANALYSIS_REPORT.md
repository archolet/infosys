# InfoSYS Proje Analiz Raporu

**Tarih:** 2 Ocak 2026
**Analiz Eden:** Jules (AI Software Engineer)

## 1. Genel Bakış
InfoSYS, modern teknolojilerle geliştirilmiş, **Clean Architecture** prensiplerine sadık, ölçeklenebilir bir kurumsal ERP çözümüdür. Proje, güçlü bir backend mimarisi (.NET 10) ve güncel bir frontend teknolojisi (Next.js 16) üzerine inşa edilmiştir.

### Temel Teknoloji Yığını
- **Backend:** .NET 10, C# 13, Entity Framework Core 10.0.1
- **Frontend:** Next.js 16.1.1, React 19.2.3, Tailwind CSS v4, TypeScript
- **Veritabanı:** PostgreSQL 18.1
- **Mimari:** Clean Architecture + CQRS (MediatR)
- **DevOps:** Docker Compose, Makefile otomasyonu

---

## 2. Backend Analizi (.NET)

Backend yapısı `Backend/` klasörü altında, modüler ve katmanlı bir yapıda kurgulanmıştır.

### 2.1. Mimari Katmanlar
- **Core (Çekirdek):** `InfoSystem.Core` adı altında 26 adet yeniden kullanılabilir kütüphane içerir. Güvenlik, loglama, cache, mail gibi "Cross-Cutting Concerns" bu katmanda merkezi olarak yönetilmektedir.
- **Domain:** Veritabanı varlıklarını (Entities) içerir (Örn: `User`, `OperationClaim`).
- **Application:** İş mantığının (Business Logic) bulunduğu yerdir. **CQRS** deseni MediatR kütüphanesi ile uygulanmıştır.
    - **Pipeline Behaviors:** Her istek için otomatik devreye giren mekanizmalar mevcuttur:
        - `AuthorizationBehavior` (Yetki kontrolü)
        - `CachingBehavior` (Redis/Memory cache)
        - `LoggingBehavior` (Serilog tabanlı loglama)
        - `ValidationBehavior` (FluentValidation)
        - `TransactionScopeBehavior` (Veritabanı işlemleri bütünlüğü)
- **Persistence:** Veritabanı erişim katmanıdır. `BaseDbContext` üzerinden PostgreSQL ile iletişim kurar. Migration yönetimi burada yapılır.
- **WebAPI:** Dış dünyaya açılan kapıdır. Controller'lar sadece MediatR'a komut gönderir (Thin Controller prensibi).
- **Infrastructure:** Dış servis entegrasyonlarını barındırır (File service vb.).

### 2.2. Güvenlik ve Kimlik Doğrulama
- **JWT (JSON Web Token):** Kimlik doğrulama için kullanılır. Access Token süresi 480 dakika olarak ayarlanmıştır.
- **Refresh Token:** Token yenileme mekanizması mevcuttur.
- **2FA:** Email ve OTP tabanlı iki faktörlü doğrulama altyapısı mevcuttur.
- **Swagger:** API dokümantasyonu için Swashbuckle kullanılır ve JWT desteği eklenmiştir.

### 2.3. Konfigürasyon
- `appsettings.json` üzerinden veritabanı, mail, elasticsearch ve loglama ayarları yönetilir.
- Geliştirme ortamında `DistributedMemoryCache` kullanılmakla birlikte, altyapı Redis (StackExchangeRedis) desteklemektedir.

---

## 3. Frontend Analizi (Next.js)

Frontend uygulaması `frontend/` klasöründe yer alır ve son derece güncel bir teknoloji yığınına sahiptir.

### 3.1. Yapı ve Routing
- **App Router:** Next.js 16'nın yeni App Router yapısı (`src/app`) kullanılmaktadır.
- **Middleware:** `middleware.ts` dosyası ile rota koruması sağlanmıştır. `refreshToken` çerezi kontrol edilerek:
    - Login olmuş kullanıcılar Auth sayfalarından (Login/Register) Dashboard'a yönlendirilir.
    - Login olmamış kullanıcılar korumalı sayfalardan Login sayfasına yönlendirilir.

### 3.2. Durum Yönetimi (State Management)
- Harici bir kütüphane (Redux, Zustand vb.) yerine React Context API (`AuthProvider`) tercih edilmiştir. Bu, projenin karmaşıklığını azaltan yerinde bir karardır.

### 3.3. Stil ve UI
- **Tailwind CSS v4:** En güncel CSS framework sürümü kullanılmaktadır.
- **Font:** `next/font/google` ile Geist font ailesi entegre edilmiştir.

---

## 4. Altyapı ve DevOps

### 4.1. Docker
- `docker-compose.yml` dosyası geliştirme ortamı için gerekli servisleri barındırır:
    - **PostgreSQL 18.1:** Ana veritabanı.
    - **pgAdmin 4:** Veritabanı yönetim arayüzü.

### 4.2. Otomasyon (Makefile)
- Proje yönetimini kolaylaştıran kapsamlı bir `Makefile` mevcuttur.
- Önemli komutlar:
    - `make start`: Tüm sistemi (DB + API + Frontend) tek komutla ayağa kaldırır.
    - `make port-status`: Kullanılan portları listeler.
    - `make fresh-all`: Projeyi sıfırdan temizleyip kurar.

---

## 5. Değerlendirme ve Sonuç

**Güçlü Yönler:**
1.  **Teknoloji Uyumu:** Hem Backend (.NET 10) hem Frontend (Next.js 16) tarafında en son teknolojiler kullanılmıştır.
2.  **Core Kütüphanesi:** Ortak kodların merkezi `Core` kütüphanesinde toplanması, kod tekrarını önler ve bakımı kolaylaştırır.
3.  **Clean Architecture:** Katmanlı yapı, projenin test edilebilirliğini ve sürdürülebilirliğini artırır.
4.  **Geliştirici Deneyimi:** Makefile ve Docker yapılandırması, yeni başlayan bir geliştiricinin projeyi ayağa kaldırmasını çok kolaylaştırmaktadır.

**Gözlemler:**
- Proje şu an geliştirme aşamasında (Development mode) yapılandırılmıştır. Prodüksiyon ortamı için Redis ve ElasticSearch servislerinin Docker Compose'a veya harici bir konfigürasyona eklenmesi gerekebilir (şu an kodda referansları var ancak docker-compose'da sadece Postgres var).

**Sonuç:**
InfoSYS, modern yazılım geliştirme standartlarına uygun, sağlam temellere sahip bir projedir. Mimari kararlar ölçeklenebilirliği destekleyecek şekilde verilmiştir.
