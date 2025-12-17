---
description: Ultra hassas prompt modu - Serena MCP, task parsing, memory checkpointing
---

🎯 **ULTRA HASSAS MOD AKTİF**

Bu görevi özel işlem modunda yürüt:

$ARGUMENTS

---

## ZORUNLU ADIMLAR

### 1. BAŞLANGIÇ - Memory Kaydet
Serena write_memory ile mevcut durumu kaydet:
- memory_file_name: "{proje}-{görev}-başlangıç.md"
- content: Mevcut durum analizi, hangi dosyalar etkilenecek

### 2. PARÇALA - Task'lara Böl
- Prompt'u mantıksal task'lara ayır
- Her task'ı `TodoWrite` ile ekle
- Bağımlılık sırasını belirle
- Aynı anda sadece 1 task IN_PROGRESS olsun

### 3. SERENA KULLAN - Standard Tool'ları Kullanma

| İşlem | Serena Tool | Standard Tool (KULLANMA) |
|-------|-------------|--------------------------|
| Kod oku | `find_symbol`, `get_symbols_overview` | Read, Grep |
| Kod düzenle | `replace_symbol_body`, `replace_content` | Edit |
| Dosya oluştur | `create_text_file` | Write |
| Arama | `search_for_pattern` | Glob, Grep |
| Düşün | `think_about_task_adherence` | - |
| Shell | `execute_shell_command` | Bash |

### 4. CHECKPOINT - Her Milestone'da
Her major adımda Serena write_memory:
- memory_file_name: "{proje}-{görev}-checkpoint-{n}.md"
- content: Tamamlanan adımlar, sonraki adımlar

### 5. SONUÇ - Final Memory
İşlem bittiğinde:
- memory_file_name: "{proje}-{görev}-final.md"
- content: Özet rapor, değişen dosyalar, test sonuçları

---

## KRİTİK KURALLAR

1. **Serena Öncelikli**: Standard Claude Code tool'ları (Read, Edit, Write, Glob, Grep, Bash) yerine Serena MCP tool'larını kullan
2. **Memory Zorunlu**: Başlangıç, checkpoint ve final memory'leri MUTLAKA yaz
3. **Task Tracking**: Her adımı TodoWrite ile takip et
4. **Think Sık Kullan**: `think_about_task_adherence` ve `think_about_collected_information` kullan
5. **Symbolic Editing**: Mümkünse `replace_symbol_body` tercih et

---

**NOT**: Bu mod aktifken context kalıcı olur. Session kapansa bile memory'den devam edilebilir.
