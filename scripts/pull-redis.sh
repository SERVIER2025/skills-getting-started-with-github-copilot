#!/usr/bin/env bash
# pull-redis.sh - Pull a Redis Docker image and optionally verify it.
#
# Usage:
#   ./scripts/pull-redis.sh [TAG]
#
# Examples:
#   ./scripts/pull-redis.sh              # pulls redis:latest
#   ./scripts/pull-redis.sh 7.2-alpine   # pulls redis:7.2-alpine

set -euo pipefail

TAG="${1:-latest}"
IMAGE="redis:${TAG}"

echo "==> Pulling ${IMAGE} ..."
docker pull "${IMAGE}"

echo ""
echo "==> Image info:"
docker images "${IMAGE}" --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}\t{{.CreatedAt}}"

echo ""
echo "==> Inspect digest:"
docker inspect --format '{{index .RepoDigests 0}}' "${IMAGE}" 2>/dev/null || true

echo ""
echo "Done. ${IMAGE} is ready to use."
