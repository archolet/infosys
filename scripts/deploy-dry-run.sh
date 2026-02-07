#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STRICT="${STRICT:-0}"
KEEP_SERVICES_RUNNING="${KEEP_SERVICES_RUNNING:-0}"

cd "${ROOT_DIR}"

echo "[dry-run] starting release preflight"
STRICT="${STRICT}" ./scripts/release-preflight.sh

echo "[dry-run] executing runtime smoke"
KEEP_SERVICES_RUNNING="${KEEP_SERVICES_RUNNING}" ./scripts/smoke-auth-flow.sh

echo "[dry-run] deploy simulation completed successfully"
echo "[dry-run] no deployment command was executed"
