# InfoSYS - PostgreSQL Migration Başlangıç

## Mevcut Durum Analizi

### Database Yapılandırması
- **Şu anda**: InMemory Database (`UseInMemoryDatabase("BaseDb")`)
- **Hedef**: PostgreSQL 18.1 (Docker)

### Etkilenecek Dosyalar
1. `Backend/src/Persistence/Persistence.csproj` - Npgsql paketi eklenecek
2. `Backend/src/Persistence/PersistenceServiceRegistration.cs` - UseNpgsql yapılacak
3. `Backend/src/WebAPI/appsettings.json` - Connection string güncellenecek
4. `docker-compose.yml` - Yeni oluşturulacak (postgres:18.1)
5. `Backend/src/Persistence/Migrations/` - EF Core migration'lar

### Mevcut Entity'ler (BaseDbContext)
- EmailAuthenticator
- OperationClaim
- OtpAuthenticator
- RefreshToken
- User
- UserOperationClaim

### EntityConfigurations
- Backend/src/Persistence/EntityConfigurations/ dizininde yapılandırmalar var
- `modelBuilder.ApplyConfigurationsFromAssembly()` ile uygulanıyor

## Yapılacak Görevler
1. Docker compose oluştur (postgres:18.1)
2. Npgsql paketini ekle
3. PersistenceServiceRegistration güncelle
4. appsettings.json güncelle
5. Initial migration oluştur
6. Docker'ı başlat ve test et
