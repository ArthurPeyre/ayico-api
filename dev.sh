#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE="docker compose -f $BASE_DIR/docker-compose.yml -f $BASE_DIR/docker-compose.dev.yml"

usage() {
    cat <<EOF
Usage: $(basename "$0") <commande>

Commandes:
  up       Demarre l'api en mode dev (tsx watch, rebuild auto au save, pas de rebuild d'image)
  down     Arrete le conteneur dev
  logs     Suit les logs du conteneur dev
EOF
}

case "${1:-}" in
    up)
        $COMPOSE up -d --build
        ;;
    down)
        $COMPOSE down
        ;;
    logs)
        $COMPOSE logs -f
        ;;
    *)
        usage
        exit 1
        ;;
esac
