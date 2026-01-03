# InfoSYS Port Yönetimi - Başlangıç

**Tarih:** 2025-12-18
**Görev:** Makefile'a port yönetimi ekle

## Problem Tanımı

1. **macOS'ta port kill sorunu** - Standard `kill` komutları çalışmıyor
2. **Portlar dolu kalıyor** - `dotnet run` sonrası portlar serbest bırakılmıyor
3. **Proje portları sabit** - API: 5001, UI: 5192 - değiştirmek istemiyoruz

## Mevcut Portlar

| Proje | Port | Protokol |
|-------|------|----------|
| WebAPI | 5001 (HTTPS), 5000 (HTTP) | HTTPS |
| Blazor UI | 5192 (HTTP) | HTTP |

## Etkilenecek Dosyalar

- `/Makefile` - Port yönetimi komutları eklenecek

## Yapılacaklar

1. Web araştırması - macOS port kill best practices
2. 20 adımlık sequential thinking analizi
3. Makefile'a port kill komutları ekle
4. Test et

## macOS Port Kill Sorunları

- `lsof -i :PORT` çıktısı farklı olabilir
- `kill -9` yetersiz kalabiliyor
- `pkill` pattern matching sorunları
- launchd process'leri restart edebilir
