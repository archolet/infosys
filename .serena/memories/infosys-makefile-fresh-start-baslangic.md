# InfoSYS Makefile Fresh Start Komutları - Başlangıç

**Tarih:** 2025-12-18
**Görev:** Makefile'a "fresh start" komutları ekle

---

## Mevcut Durum

### Etkilenecek Dosya
- `Makefile` - Ana build automation dosyası

### İstenen Komutlar
1. **Core Fresh Build**: Core dizinindeki projelerin bin/obj silip rebuild
2. **Backend Fresh Start**: Backend/src bin/obj silip rebuild ve WebAPI başlat
3. **Frontend Fresh Start**: Frontend bin/obj silip rebuild ve başlat
4. **Kısa Yollar**: Tüm komutlar için alias'lar

### Proje Yapısı (Önceki Analiz)
```
Backend/
├── Core/                    # 26 proje
│   └── src/
│       ├── Foundation/
│       ├── Security/
│       └── ...
└── src/
    ├── Application/
    ├── Domain/
    ├── Persistence/
    ├── Infrastructure/
    └── WebAPI/              # Port 5278

Frontend/
└── InfoSYS.WebUI/           # Port 5192/7089
```

### Port Bilgileri
- API_PORT: 5278
- UI_HTTP_PORT: 5192
- UI_HTTPS_PORT: 7089

---

## Plan
1. Sequential thinking ile 10 adımlık analiz
2. Makefile'a fresh-* komutları ekle
3. Kısa yollar (alias) tanımla
4. Test et
