# InfoSYS Slash Commands Entegrasyonu - Başlangıç

## Görev
SuperClaude Framework'ün /sc:index ve /sc:document komutlarını InfoSYS projesine entegre et:
- /sc:index → /index
- /sc:document → /document

## Hedef Dizin
```
.claude/commands/
├── index.md      # Proje indexleme komutu
└── document.md   # Bileşen dokümantasyon komutu
```

## Kaynak Analiz (SuperClaude'dan)

### /sc:index Özellikleri
- category: special
- mcp-servers: [sequential, context7]
- personas: [architect, scribe, quality]
- Amaç: Tüm proje için knowledge base

### /sc:document Özellikleri
- category: utility
- mcp-servers: []
- personas: []
- Amaç: Tek bileşen dokümantasyonu

## InfoSYS Adaptasyonları
- .NET/C# odaklı
- Clean Architecture uyumlu
- CQRS pattern desteği
- Mevcut CLAUDE.md ile entegre

## Durum
- Başlangıç: 2025-12-18
- Status: IN_PROGRESS
