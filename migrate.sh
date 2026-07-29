#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE="node:20-alpine"
NETWORK="backend"

usage() {
    cat <<EOF
Usage: $(basename "$0") <commande> [nom_migration]

Commandes:
  create <nom>   Cree un nouveau fichier de migration SQL
  up             Applique les migrations en attente
  down           Annule la derniere migration appliquee
  status         Affiche ce qui serait applique, sans rien executer (dry-run)

Exemples:
  $(basename "$0") create create_devices_schema
  $(basename "$0") up
  $(basename "$0") down
  $(basename "$0") status
EOF
}

ensure_deps() {
    docker run --rm -v "$BASE_DIR":/app -w /app "$IMAGE" npm install --no-audit --no-fund
}

run_migrate() {
    docker run --rm \
        --network "$NETWORK" \
        -v "$BASE_DIR":/app \
        -w /app \
        "$IMAGE" \
        npx node-pg-migrate "$@" --envPath .env
}

cmd="${1:-}"

case "$cmd" in
    create)
        name="${2:-}"
        if [[ -z "$name" ]]; then
            echo "Erreur: precise un nom, ex: $(basename "$0") create create_devices_schema"
            exit 1
        fi
        ensure_deps
        run_migrate create "$name" -j sql
        ;;
    up)
        ensure_deps
        run_migrate up
        ;;
    down)
        ensure_deps
        run_migrate down
        ;;
    status)
        ensure_deps
        run_migrate up --dry-run
        ;;
    *)
        usage
        exit 1
        ;;
esac
