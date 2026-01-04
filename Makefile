# InfoSYS ERP - Build Automation
# Multi-solution yönetimi için Makefile

.PHONY: help build-all build-core build-backend build-frontend build-nextjs test run-api run-ui run-nextjs format clean
.PHONY: port-status kill-api kill-ui kill-nextjs kill-all restart-api restart-ui restart-nextjs restart-all
.PHONY: fresh-core fresh-backend fresh-frontend fresh-nextjs fresh-all
.PHONY: ps ka ku kn kall fc fb ff fn fa  # Kısa alias'lar

# ═══════════════════════════════════════════════════════════════════════════════
# Port Configuration (launchSettings.json'dan alındı - DEĞİŞTİRME!)
# ═══════════════════════════════════════════════════════════════════════════════
API_PORT := 5278
UI_HTTP_PORT := 5192
UI_HTTPS_PORT := 7089
NEXTJS_PORT := 3000

# ═══════════════════════════════════════════════════════════════════════════════
# Reusable Port Kill Function (macOS optimized)
# Usage: $(call kill_port,PORT_NUMBER)
# ═══════════════════════════════════════════════════════════════════════════════
define kill_port
	@PID=$$(lsof -t -i :$(1) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo "   ↳ Port $(1): SIGTERM gönderiliyor (PID: $$PID)"; \
		kill $$PID 2>/dev/null || true; \
		sleep 2; \
		if kill -0 $$PID 2>/dev/null; then \
			echo "   ↳ Port $(1): Process hala çalışıyor, SIGKILL gönderiliyor"; \
			kill -9 $$PID 2>/dev/null || true; \
		fi; \
	else \
		echo "   ↳ Port $(1): Zaten boş ✓"; \
	fi
endef

# ═══════════════════════════════════════════════════════════════════════════════
# Quick Start - Tek Komutla Herşeyi Başlat (Next.js + API)
# ═══════════════════════════════════════════════════════════════════════════════

# Tek komutla: PostgreSQL kontrol + portları temizle + API + Next.js başlat
start: check-postgres kill-all
	@echo ""
	@echo "🚀 InfoSYS başlatılıyor..."
	@echo "══════════════════════════════════════════════════════"
	@echo ""
	@# API'yi background'da başlat
	@echo "🖥️  Backend API başlatılıyor (port $(API_PORT))..."
	@dotnet run --project Backend/src/WebAPI/ > /tmp/infosys-api.log 2>&1 &
	@sleep 3
	@# API health check
	@if curl -s http://localhost:$(API_PORT)/swagger/index.html > /dev/null 2>&1; then \
		echo "   ✅ API hazır: http://localhost:$(API_PORT)"; \
	else \
		echo "   ⏳ API başlatılıyor... (birkaç saniye bekleyin)"; \
	fi
	@echo ""
	@echo "🌐 Next.js Frontend başlatılıyor (port $(NEXTJS_PORT))..."
	@echo "══════════════════════════════════════════════════════"
	@echo ""
	@echo "📱 Tarayıcıda aç: http://localhost:$(NEXTJS_PORT)"
	@echo "👤 Giriş: info@info.com.tr / 12345"
	@echo ""
	@echo "══════════════════════════════════════════════════════"
	cd frontend && npm run dev

# PostgreSQL Docker container kontrolü
check-postgres:
	@echo "🐘 PostgreSQL kontrol ediliyor..."
	@if docker ps --format '{{.Names}}' | grep -q 'infosys-postgres'; then \
		echo "   ✅ PostgreSQL çalışıyor"; \
	elif docker ps -a --format '{{.Names}}' | grep -q 'infosys-postgres'; then \
		echo "   ⏳ PostgreSQL başlatılıyor..."; \
		docker start infosys-postgres > /dev/null 2>&1; \
		sleep 2; \
		echo "   ✅ PostgreSQL başlatıldı"; \
	else \
		echo "   ⚠️  PostgreSQL container bulunamadı!"; \
		echo "   → Oluşturmak için:"; \
		echo "     docker run --name infosys-postgres -e POSTGRES_USER=postgres \\"; \
		echo "       -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=InfoSYSDb \\"; \
		echo "       -p 5432:5432 -d postgres:16"; \
		exit 1; \
	fi

# API'yi background'da durdur
stop-api:
	@echo "🛑 API durduruluyor..."
	@pkill -f "Backend/src/WebAPI" 2>/dev/null || true
	@pkill -f "dotnet.*WebAPI" 2>/dev/null || true
	$(call kill_port,$(API_PORT))
	@echo "   ✅ API durduruldu"

# Tüm servisleri durdur
stop: stop-api kill-nextjs
	@echo ""
	@echo "🛑 Tüm servisler durduruldu"

# Default target
help:
	@echo "InfoSYS ERP Build Commands"
	@echo "=========================="
	@echo ""
	@echo "⚡ Quick Start (Önerilen):"
	@echo "  make start            - Tek komutla herşeyi başlat (PostgreSQL + API + Next.js)"
	@echo "  make stop             - Tüm servisleri durdur"
	@echo ""
	@echo "Build:"
	@echo "  make build-all      - Tüm projeleri build et (InfoSYS.sln)"
	@echo "  make build-core     - Sadece Core paketlerini build et"
	@echo "  make build-backend  - Sadece Backend projelerini build et"
	@echo "  make build-frontend - Sadece Blazor Frontend'i build et"
	@echo "  make build-nextjs   - Next.js frontend'i build et"
	@echo ""
	@echo "Run:"
	@echo "  make run-api        - WebAPI'yi çalıştır (localhost:$(API_PORT))"
	@echo "  make run-nextjs     - Next.js Frontend çalıştır (localhost:$(NEXTJS_PORT))"
	@echo "  make run-ui         - Blazor UI'ı çalıştır (localhost:$(UI_HTTP_PORT)/$(UI_HTTPS_PORT))"
	@echo "  make run-all        - API ve UI'ı birlikte çalıştır"
	@echo ""
	@echo "Fresh Start (Sıfırdan Başlat):"
	@echo "  make fresh-core     - Core bin/obj sil + rebuild      (alias: fc)"
	@echo "  make fresh-backend  - Backend sıfırla + API başlat    (alias: fb)"
	@echo "  make fresh-frontend - Blazor sıfırla + UI başlat      (alias: ff)"
	@echo "  make fresh-nextjs   - Next.js node_modules + rebuild  (alias: fn)"
	@echo "  make fresh-all      - Tümünü sıfırla + başlat         (alias: fa)"
	@echo ""
	@echo "Port Management (macOS):"
	@echo "  make port-status    - Port durumunu göster          (alias: ps)"
	@echo "  make kill-api       - API portunu serbest bırak     (alias: ka)"
	@echo "  make kill-nextjs    - Next.js portunu serbest bırak (alias: kn)"
	@echo "  make kill-ui        - UI portlarını serbest bırak   (alias: ku)"
	@echo "  make kill-all       - Tüm portları serbest bırak    (alias: kall)"
	@echo "  make restart-api    - API'yi yeniden başlat (kill + run)"
	@echo "  make restart-nextjs - Next.js'i yeniden başlat (kill + run)"
	@echo "  make restart-ui     - Blazor UI'ı yeniden başlat (kill + run)"
	@echo ""
	@echo "Test:"
	@echo "  make test           - Tüm testleri çalıştır"
	@echo "  make test-filter F= - Belirli testi çalıştır (örn: make test-filter F=LoginTests)"
	@echo ""
	@echo "Other:"
	@echo "  make format         - Kodu formatla (CSharpier)"
	@echo "  make clean          - Build artifactlarını temizle"
	@echo "  make restore        - NuGet paketlerini restore et"

# Build commands
build-all:
	@echo "🔨 Building all projects..."
	dotnet build Backend/InfoSYS.sln

build-core:
	@echo "🔨 Building Core packages..."
	dotnet build Backend/Core/CorePackages.sln

build-backend:
	@echo "🔨 Building Backend (solution filter)..."
	dotnet build Backend/InfoSYS.Backend.slnf

build-frontend:
	@echo "🔨 Building Blazor Frontend..."
	dotnet build Frontend/InfoSYS.WebUI/InfoSYS.WebUI.csproj

build-nextjs:
	@echo "🔨 Building Next.js Frontend..."
	cd frontend && npm run build

# Run commands
run-api:
	@echo "🚀 Starting WebAPI on port $(API_PORT)..."
	@# Port meşgul kontrolü
	@PID=$$(lsof -t -i :$(API_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo "⚠️  Port $(API_PORT) meşgul (PID: $$PID)"; \
		echo "   → Önce 'make kill-api' çalıştırın veya 'make restart-api' kullanın"; \
		exit 1; \
	fi
	dotnet run --project Backend/src/WebAPI/

run-nextjs:
	@echo "🚀 Starting Next.js Frontend on port $(NEXTJS_PORT)..."
	@# Port meşgul kontrolü
	@PID=$$(lsof -t -i :$(NEXTJS_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo "⚠️  Port $(NEXTJS_PORT) meşgul (PID: $$PID)"; \
		echo "   → Önce 'make kill-nextjs' çalıştırın veya 'make restart-nextjs' kullanın"; \
		exit 1; \
	fi
	cd frontend && npm run dev

run-ui:
	@echo "🚀 Starting Blazor UI on ports $(UI_HTTP_PORT)/$(UI_HTTPS_PORT)..."
	@# Port meşgul kontrolü
	@PID=$$(lsof -t -i :$(UI_HTTP_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$PID" ]; then \
		echo "⚠️  Port $(UI_HTTP_PORT) meşgul (PID: $$PID)"; \
		echo "   → Önce 'make kill-ui' çalıştırın veya 'make restart-ui' kullanın"; \
		exit 1; \
	fi
	dotnet run --project Frontend/InfoSYS.WebUI/

run-all:
	@echo "🚀 Starting API and UI..."
	@$(MAKE) run-api &
	@$(MAKE) run-ui

# Test commands
test:
	@echo "🧪 Running all tests..."
	dotnet test Backend/tests/StarterProject.Application.Tests/

test-filter:
	@echo "🧪 Running filtered tests: $(F)..."
	dotnet test Backend/tests/StarterProject.Application.Tests/ --filter "FullyQualifiedName~$(F)"

# Utility commands
format:
	@echo "✨ Formatting code..."
	dotnet csharpier Backend/

clean:
	@echo "🧹 Cleaning build artifacts..."
	dotnet clean Backend/InfoSYS.sln
	dotnet clean Backend/Core/CorePackages.sln
	find . -type d -name "bin" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "obj" -exec rm -rf {} + 2>/dev/null || true

restore:
	@echo "📦 Restoring NuGet packages..."
	dotnet restore Backend/InfoSYS.sln

# Database commands
db-migrate:
	@echo "🗃️ Creating migration..."
	@read -p "Migration name: " name; \
	dotnet ef migrations add $$name --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/

db-update:
	@echo "🗃️ Updating database..."
	dotnet ef database update --project Backend/src/Persistence/ --startup-project Backend/src/WebAPI/

# ═══════════════════════════════════════════════════════════════════════════════
# Port Management Commands (macOS Optimized)
# ═══════════════════════════════════════════════════════════════════════════════

# Port durumunu göster
port-status:
	@echo "📊 InfoSYS Port Durumu"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo ""
	@echo "🔹 WebAPI (port $(API_PORT)):"
	@OUTPUT=$$(lsof -i :$(API_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$OUTPUT" ]; then echo "$$OUTPUT" | head -5; else echo "   ✅ Boş - kullanıma hazır"; fi
	@echo ""
	@echo "🔹 Next.js Frontend (port $(NEXTJS_PORT)):"
	@OUTPUT=$$(lsof -i :$(NEXTJS_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$OUTPUT" ]; then echo "$$OUTPUT" | head -5; else echo "   ✅ Boş - kullanıma hazır"; fi
	@echo ""
	@echo "🔹 Blazor UI HTTP (port $(UI_HTTP_PORT)):"
	@OUTPUT=$$(lsof -i :$(UI_HTTP_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$OUTPUT" ]; then echo "$$OUTPUT" | head -5; else echo "   ✅ Boş - kullanıma hazır"; fi
	@echo ""
	@echo "🔹 Blazor UI HTTPS (port $(UI_HTTPS_PORT)):"
	@OUTPUT=$$(lsof -i :$(UI_HTTPS_PORT) -sTCP:LISTEN 2>/dev/null); \
	if [ -n "$$OUTPUT" ]; then echo "$$OUTPUT" | head -5; else echo "   ✅ Boş - kullanıma hazır"; fi
	@echo ""
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# API portunu serbest bırak (3 aşamalı kill stratejisi)
kill-api:
	@echo "🔪 API sonlandırılıyor (port $(API_PORT))..."
	$(call kill_port,$(API_PORT))
	@# Yedek: Process pattern ile kill (sessiz)
	@pkill -f "Backend/src/WebAPI" 2>/dev/null || true
	@echo "✅ API portu ($(API_PORT)) serbest bırakıldı"

# Next.js portunu serbest bırak
kill-nextjs:
	@echo "🔪 Next.js sonlandırılıyor (port $(NEXTJS_PORT))..."
	$(call kill_port,$(NEXTJS_PORT))
	@# Yedek: Process pattern ile kill (sessiz)
	@pkill -f "next-server" 2>/dev/null || true
	@pkill -f "node.*frontend" 2>/dev/null || true
	@echo "✅ Next.js portu ($(NEXTJS_PORT)) serbest bırakıldı"

# UI portlarını serbest bırak
kill-ui:
	@echo "🔪 UI sonlandırılıyor (portlar $(UI_HTTP_PORT)/$(UI_HTTPS_PORT))..."
	$(call kill_port,$(UI_HTTP_PORT))
	$(call kill_port,$(UI_HTTPS_PORT))
	@# Yedek: Process pattern ile kill (sessiz)
	@pkill -f "InfoSYS.WebUI" 2>/dev/null || true
	@echo "✅ UI portları ($(UI_HTTP_PORT)/$(UI_HTTPS_PORT)) serbest bırakıldı"

# Tüm InfoSYS portlarını serbest bırak
kill-all: kill-api kill-nextjs kill-ui
	@echo ""
	@echo "🧹 Tüm InfoSYS portları temizlendi"
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# API'yi yeniden başlat (kill + run)
restart-api: kill-api
	@echo ""
	@echo "🔄 API yeniden başlatılıyor..."
	@sleep 1
	@$(MAKE) run-api

# Next.js'i yeniden başlat (kill + run)
restart-nextjs: kill-nextjs
	@echo ""
	@echo "🔄 Next.js yeniden başlatılıyor..."
	@sleep 1
	@$(MAKE) run-nextjs

# UI'ı yeniden başlat (kill + run)
restart-ui: kill-ui
	@echo ""
	@echo "🔄 UI yeniden başlatılıyor..."
	@sleep 1
	@$(MAKE) run-ui

# Tüm servisleri yeniden başlat
restart-all: kill-all
	@echo ""
	@echo "🔄 Tüm servisler yeniden başlatılıyor..."
	@sleep 1
	@$(MAKE) run-all

# ═══════════════════════════════════════════════════════════════════════════════
# Fresh Start Commands (Sıfırdan Başlat)
# ═══════════════════════════════════════════════════════════════════════════════

# Core: bin/obj sil + rebuild (library projeler, run yok)
fresh-core:
	@echo "🔄 Core projeleri sıfırdan build ediliyor..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "   ↳ bin/obj klasörleri siliniyor..."
	@find Backend/Core -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} + 2>/dev/null || true
	@echo "   ↳ NuGet restore ediliyor..."
	@dotnet restore Backend/Core/CorePackages.sln --verbosity quiet
	@echo "   ↳ Build ediliyor..."
	@dotnet build Backend/Core/CorePackages.sln --no-restore --verbosity quiet
	@echo "✅ Core projeleri hazır"

# Backend: bin/obj sil + rebuild + WebAPI başlat
fresh-backend: kill-api
	@echo "🔄 Backend sıfırdan başlatılıyor..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "   ↳ bin/obj klasörleri siliniyor..."
	@find Backend/src -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} + 2>/dev/null || true
	@echo "   ↳ NuGet restore ediliyor..."
	@dotnet restore Backend/InfoSYS.Backend.slnf --verbosity quiet
	@echo "   ↳ Build ediliyor..."
	@dotnet build Backend/InfoSYS.Backend.slnf --no-restore --verbosity quiet
	@echo "   ↳ WebAPI başlatılıyor (port $(API_PORT))..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	dotnet run --project Backend/src/WebAPI/ --no-build

# Blazor Frontend: bin/obj sil + rebuild + Blazor UI başlat
fresh-frontend: kill-ui
	@echo "🔄 Blazor Frontend sıfırdan başlatılıyor..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "   ↳ bin/obj klasörleri siliniyor..."
	@find Frontend -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} + 2>/dev/null || true
	@echo "   ↳ NuGet restore ediliyor..."
	@dotnet restore Frontend/InfoSYS.WebUI/InfoSYS.WebUI.csproj --verbosity quiet
	@echo "   ↳ Build ediliyor..."
	@dotnet build Frontend/InfoSYS.WebUI/InfoSYS.WebUI.csproj --no-restore --verbosity quiet
	@echo "   ↳ Blazor UI başlatılıyor (port $(UI_HTTP_PORT)/$(UI_HTTPS_PORT))..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	dotnet run --project Frontend/InfoSYS.WebUI/ --no-build

# Next.js: node_modules sil + reinstall + dev server başlat
fresh-nextjs: kill-nextjs
	@echo "🔄 Next.js sıfırdan başlatılıyor..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	@echo "   ↳ node_modules ve .next siliniyor..."
	@rm -rf frontend/node_modules frontend/.next 2>/dev/null || true
	@echo "   ↳ npm install ediliyor..."
	@cd frontend && npm install --silent
	@echo "   ↳ Next.js başlatılıyor (port $(NEXTJS_PORT))..."
	@echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
	cd frontend && npm run dev

# Tümü: Sıfırdan temiz başlangıç (Core → Backend → Frontend)
fresh-all: kill-all
	@echo "🔄 TÜM PROJELER SIFIRDAN BAŞLATILIYOR..."
	@echo "══════════════════════════════════════════════════════"
	@echo ""
	@# Adım 1: Tüm bin/obj temizle
	@echo "📁 [1/4] Tüm bin/obj klasörleri siliniyor..."
	@find Backend -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} + 2>/dev/null || true
	@find Frontend -type d \( -name "bin" -o -name "obj" \) -exec rm -rf {} + 2>/dev/null || true
	@echo "   ✓ Temizlik tamamlandı"
	@echo ""
	@# Adım 2: Core build
	@echo "📦 [2/4] Core paketleri build ediliyor..."
	@dotnet build Backend/Core/CorePackages.sln --verbosity quiet
	@echo "   ✓ Core hazır"
	@echo ""
	@# Adım 3: Backend build + API başlat (background)
	@echo "🖥️  [3/4] Backend build + WebAPI başlatılıyor..."
	@dotnet build Backend/InfoSYS.Backend.slnf --verbosity quiet
	@echo "   ✓ Backend build tamamlandı"
	@$(MAKE) run-api &
	@sleep 3
	@echo ""
	@# Adım 4: Frontend build + UI başlat
	@echo "🌐 [4/4] Frontend build + Blazor UI başlatılıyor..."
	@dotnet build Frontend/InfoSYS.WebUI/InfoSYS.WebUI.csproj --verbosity quiet
	@echo "   ✓ Frontend build tamamlandı"
	@echo ""
	@echo "══════════════════════════════════════════════════════"
	@echo "✅ Tüm projeler hazır! API: $(API_PORT), UI: $(UI_HTTP_PORT)/$(UI_HTTPS_PORT)"
	@echo "══════════════════════════════════════════════════════"
	$(MAKE) run-ui

# ═══════════════════════════════════════════════════════════════════════════════
# Kısa Alias'lar (Hızlı erişim)
# ═══════════════════════════════════════════════════════════════════════════════
ps: port-status
ka: kill-api
kn: kill-nextjs
ku: kill-ui
kall: kill-all
fc: fresh-core
fb: fresh-backend
ff: fresh-frontend
fn: fresh-nextjs
fa: fresh-all
