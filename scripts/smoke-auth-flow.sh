#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API_LOG="${TMPDIR:-/tmp}/infosys-api-smoke.log"
FRONTEND_LOG="${TMPDIR:-/tmp}/infosys-frontend-smoke.log"
COOKIE_JAR="${TMPDIR:-/tmp}/infosys-smoke-cookie.txt"
KEEP_SERVICES_RUNNING="${KEEP_SERVICES_RUNNING:-0}"

cleanup() {
  if [[ "${KEEP_SERVICES_RUNNING}" == "1" ]]; then
    echo "[smoke] cleanup skipped (KEEP_SERVICES_RUNNING=1)"
    return
  fi

  pkill -f "dotnet run --project Backend/src/WebAPI/" >/dev/null 2>&1 || true
  pkill -f "/Backend/src/WebAPI/bin/Debug/net10.0/WebAPI" >/dev/null 2>&1 || true
  pkill -f "next dev" >/dev/null 2>&1 || true
  pkill -f "next-server" >/dev/null 2>&1 || true
}

trap cleanup EXIT

cd "${ROOT_DIR}"

echo "[smoke] starting postgres"
docker compose up -d postgres >/dev/null

echo "[smoke] waiting for postgres health"
for i in $(seq 1 30); do
  health="$(docker inspect -f '{{.State.Health.Status}}' infosys-postgres 2>/dev/null || echo unknown)"
  if [[ "${health}" == "healthy" ]]; then
    break
  fi

  if [[ "${i}" -eq 30 ]]; then
    echo "[smoke] postgres did not become healthy in time"
    docker logs infosys-postgres | tail -n 80
    exit 1
  fi

  sleep 2
done

echo "[smoke] starting backend api"
nohup dotnet run --project Backend/src/WebAPI/ >"${API_LOG}" 2>&1 &

for i in $(seq 1 90); do
  status="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:5278/swagger/index.html || true)"
  if [[ "${status}" == "200" ]]; then
    break
  fi

  if [[ "${i}" -eq 90 ]]; then
    echo "[smoke] backend did not start"
    tail -n 120 "${API_LOG}" || true
    exit 1
  fi

  sleep 2
done

echo "[smoke] starting frontend"
rm -f frontend/.next/dev/lock >/dev/null 2>&1 || true
nohup sh -lc 'cd frontend && PORT=3000 npm run dev' >"${FRONTEND_LOG}" 2>&1 &

for i in $(seq 1 120); do
  status="$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000 || true)"
  if [[ "${status}" == "200" || "${status}" == "307" ]]; then
    break
  fi

  if [[ "${i}" -eq 120 ]]; then
    echo "[smoke] frontend did not start"
    tail -n 120 "${FRONTEND_LOG}" || true
    exit 1
  fi

  sleep 2
done

login_page_status="$(curl --max-time 60 -s -o /dev/null -w '%{http_code}' http://localhost:3000/login || true)"
if [[ "${login_page_status}" != "200" ]]; then
  echo "[smoke] login page is not reachable, status=${login_page_status}"
  exit 1
fi

echo "[smoke] validating auth flow"
rm -f "${COOKIE_JAR}"

login_status="$(
  curl -s -o /dev/null -w '%{http_code}' \
    -c "${COOKIE_JAR}" \
    -H 'Content-Type: application/json' \
    -d '{"email":"info@info.com.tr","password":"12345"}' \
    http://localhost:5278/api/Auth/Login || true
)"

refresh_status="$(
  curl -s -o /dev/null -w '%{http_code}' \
    -b "${COOKIE_JAR}" \
    -c "${COOKIE_JAR}" \
    http://localhost:5278/api/Auth/RefreshToken || true
)"

revoke_status="$(
  curl -s -o /dev/null -w '%{http_code}' \
    -X PUT \
    -b "${COOKIE_JAR}" \
    -c "${COOKIE_JAR}" \
    http://localhost:5278/api/Auth/RevokeToken || true
)"

refresh_after_revoke_status="$(
  curl -s -o /dev/null -w '%{http_code}' \
    -b "${COOKIE_JAR}" \
    -c "${COOKIE_JAR}" \
    http://localhost:5278/api/Auth/RefreshToken || true
)"

if [[ "${login_status}" != "200" ]]; then
  echo "[smoke] login failed, status=${login_status}"
  exit 1
fi

if [[ "${refresh_status}" != "201" ]]; then
  echo "[smoke] refresh failed, status=${refresh_status}"
  exit 1
fi

if [[ "${revoke_status}" != "200" ]]; then
  echo "[smoke] revoke failed, status=${revoke_status}"
  exit 1
fi

if [[ "${refresh_after_revoke_status}" != "401" ]]; then
  echo "[smoke] refresh after revoke must be unauthorized, status=${refresh_after_revoke_status}"
  exit 1
fi

echo "[smoke] auth flow passed"

if [[ "${KEEP_SERVICES_RUNNING}" == "1" ]]; then
  echo "[smoke] services kept running as requested"
  echo "[smoke] api log: ${API_LOG}"
  echo "[smoke] frontend log: ${FRONTEND_LOG}"
fi
