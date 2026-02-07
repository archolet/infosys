#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRICT="${STRICT:-0}"

fail() {
  echo "[preflight] ERROR: $1" >&2
  exit 1
}

warn() {
  echo "[preflight] WARN: $1"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    fail "required command not found: $1"
  fi
}

validate_secret() {
  local var_name="$1"
  local current_value="${!var_name-}"
  local default_value="$2"

  if [[ -z "${current_value}" ]]; then
    if [[ "${STRICT}" == "1" ]]; then
      fail "$var_name is not set (STRICT=1)"
    fi
    warn "$var_name is not set"
    return
  fi

  if [[ -n "${default_value}" && "${current_value}" == "${default_value}" ]]; then
    if [[ "${STRICT}" == "1" ]]; then
      fail "$var_name is using default/insecure value (STRICT=1)"
    fi
    warn "$var_name is using default/insecure value"
  fi
}

cd "${ROOT_DIR}"

echo "[preflight] checking required tools"
require_command docker
require_command dotnet
require_command npm
require_command curl

echo "[preflight] validating docker compose file"
docker compose config -q

echo "[preflight] validating critical env/secrets"
validate_secret "ConnectionStrings__BaseDb" ""
validate_secret "TokenOptions__SecurityKey" "StrongAndSecretKeyStrongAndSecretKeyStrongAndSecretKeyStrongAndSecretKey"
validate_secret "POSTGRES_PASSWORD" "InfoSYS_2024!"
validate_secret "PGADMIN_DEFAULT_PASSWORD" "InfoSYS_2024!"

if [[ -n "${NEXT_PUBLIC_API_URL-}" && "${NEXT_PUBLIC_API_URL}" =~ ^http:// ]]; then
  if [[ "${STRICT}" == "1" ]]; then
    fail "NEXT_PUBLIC_API_URL uses http in STRICT mode"
  fi
  warn "NEXT_PUBLIC_API_URL uses http"
fi

echo "[preflight] running backend build and tests"
dotnet build Backend/InfoSYS.Backend.slnf >/dev/null
dotnet test Backend/tests/StarterProject.Application.Tests/StarterProject.Application.Tests.csproj >/dev/null

echo "[preflight] running frontend quality gates"
(
  cd frontend
  npm run lint >/dev/null
  npm run format:check >/dev/null
  npm run build >/dev/null
)

echo "[preflight] completed successfully"
