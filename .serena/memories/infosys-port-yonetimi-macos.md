# InfoSYS macOS Port Yönetimi

**Oluşturulma:** 2025-12-18
**Analiz:** 20 adımlık sequential thinking ile derin araştırma

---

## Port Konfigürasyonu (DEĞİŞTİRİLMEMELİ!)

| Servis | Port | Kaynak |
|--------|------|--------|
| WebAPI | 5278 | `Backend/src/WebAPI/Properties/launchSettings.json` |
| Blazor UI HTTP | 5192 | `Frontend/InfoSYS.WebUI/Properties/launchSettings.json` |
| Blazor UI HTTPS | 7089 | `Frontend/InfoSYS.WebUI/Properties/launchSettings.json` |

> **Not:** CLAUDE.md'de API portu 5001 olarak belgelenmişti, gerçek port 5278.

---

## macOS Port Kill Stratejisi (3 Aşamalı)

### 1. SIGTERM (Graceful Shutdown)
```bash
kill $PID
```
- .NET Core'un cleanup yapmasını sağlar
- Kestrel connection'ları düzgün kapatır
- DI container dispose edilir

### 2. Process Pattern Kill (Yedek)
```bash
pkill -f "Backend/src/WebAPI"
pkill -f "InfoSYS.WebUI"
```
- Port bazlı kill çalışmazsa devreye girer
- Process adına göre hedefler

### 3. SIGKILL (Son Çare)
```bash
kill -9 $PID
```
- Anında sonlandırır
- Cleanup olmaz
- Port hemen serbest kalır

---

## Makefile Komutları

| Komut | Alias | Açıklama |
|-------|-------|----------|
| `make port-status` | `ps` | Tüm portların durumunu göster |
| `make kill-api` | `ka` | API portunu (5278) serbest bırak |
| `make kill-ui` | `ku` | UI portlarını (5192/7089) serbest bırak |
| `make kill-all` | `kall` | Tüm portları serbest bırak |
| `make restart-api` | - | API'yi yeniden başlat (kill + run) |
| `make restart-ui` | - | UI'ı yeniden başlat (kill + run) |

---

## macOS Specific Bilgiler

### lsof Kullanımı
```bash
# Sadece LISTEN durumundaki process'leri bul (güvenli)
lsof -t -i :PORT -sTCP:LISTEN

# Process hala var mı kontrol et
kill -0 $PID
```

### Yaygın Sorunlar

1. **CTRL+Z vs CTRL+C**
   - CTRL+Z: Process suspend olur, port KAPALI kalır
   - CTRL+C: Process sonlanır, port SERBEST kalır
   - Çözüm: `make kill-api` kullan

2. **Zombie Process**
   - Parent process'i kill et
   - Veya `kill -9` kullan

3. **Port hala meşgul görünüyor**
   - TIME_WAIT durumunda olabilir (2-4 dakika bekle)
   - Veya kernel socket timeout'u bekle

---

## Reusable Makefile Function

```makefile
define kill_port
	@PID=$$(lsof -t -i :$(1) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo "   ↳ Port $(1): SIGTERM (PID: $$PID)"; \
		kill $$PID 2>/dev/null || true; \
		sleep 2; \
		if kill -0 $$PID 2>/dev/null; then \
			echo "   ↳ Port $(1): SIGKILL"; \
			kill -9 $$PID 2>/dev/null || true; \
		fi; \
	else \
		echo "   ↳ Port $(1): Zaten boş ✓"; \
	fi
endef
```

---

## İlgili Dosyalar

- `Makefile` - Port yönetimi komutları
- `Backend/src/WebAPI/Properties/launchSettings.json` - API port config
- `Frontend/InfoSYS.WebUI/Properties/launchSettings.json` - UI port config
