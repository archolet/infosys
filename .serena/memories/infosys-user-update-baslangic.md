# InfoSYS - Kullanıcı Email/Şifre Güncelleme - Başlangıç

## Tarih
2025-12-17

## Görev
Mevcut kullanıcının email ve şifresini güncelle:
- Yeni Email: info@info.com.tr
- Yeni Şifre: 12345

## Mevcut Durum
- Users tablosunda 1 kullanıcı var
- Mevcut email: narch@kodlama... (tam değer kontrol edilecek)
- Id: ef270e6c-3125-4e87-a709-fde38c7c2...

## Etkilenecek Alanlar
1. **Veritabanı**: PostgreSQL - Users tablosu
   - Email kolonu (text)
   - PasswordHash kolonu (bytea)
   - PasswordSalt kolonu (bytea)

2. **Kod Analizi Gerekli**:
   - Password hashing mekanizması (HashingHelper)
   - Salt generation yöntemi

## Risk Analizi
- Şifre düz text olarak saklanmamalı, hash'lenmeli
- Salt değeri de yeniden üretilmeli
- Mevcut hash algoritması tespit edilmeli (muhtemelen HMACSHA512)

## Planlanan Adımlar
1. HashingHelper class'ını bul ve analiz et
2. Yeni şifre için hash ve salt üret
3. SQL UPDATE ile veritabanını güncelle
4. Test et (login dene)
