#!/bin/bash
# build.sh <version>
# Checks out the release tag on main and builds the Docker image.
# NEXT_PUBLIC_* build args are read from build.env.
#
# Usage:
#   ./build.sh 1.2.0

set -e

# ============================================
# COLORS
# ============================================
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================
# LOAD CONFIG
# ============================================
if [ ! -f "./build.env" ]; then
    log_error "build.env not found. Copy build.env.example and fill in your values."
    exit 1
fi
source ./build.env

IMAGE_NAME="${IMAGE_NAME:-auctions-frontend}"

# ============================================
# ARGS
# ============================================
VERSION="${1}"
if [ -z "${VERSION}" ]; then
    log_error "Version is required."
    echo "Usage: ./build.sh <version>"
    echo "       ./build.sh 1.2.0"
    exit 1
fi

TAG="v${VERSION}"
FULL_IMAGE_NAME="${IMAGE_NAME}:${VERSION}"

# ============================================
# PRE-FLIGHT
# ============================================
if [ ! -f "package.json" ]; then
    log_error "package.json not found. Run from the project root."
    exit 1
fi

log_info "Pulling latest changes..."
git pull

if ! git tag | grep -q "^${TAG}$"; then
    log_error "Tag ${TAG} not found. Run ./release.sh ${VERSION} first."
    exit 1
fi

if [ -z "${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" ]; then
    log_error "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set in build.env."
    exit 1
fi

if ! command -v docker &>/dev/null && ! sudo docker version &>/dev/null; then
    log_error "Docker not found."
    exit 1
fi

# ============================================
# CHECKOUT TAG
# ============================================
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)
log_info "Checking out ${TAG}..."
git checkout "${TAG}"

# Always return to original branch on exit
trap "log_info 'Returning to ${ORIGINAL_BRANCH}...'; git checkout ${ORIGINAL_BRANCH}" EXIT

# ============================================
# BUILD IMAGE
# ============================================
log_info "Building Docker image: ${FULL_IMAGE_NAME}..."
sudo docker build \
    --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}" \
    --build-arg NEXT_PUBLIC_CLERK_SIGN_IN_URL="${NEXT_PUBLIC_CLERK_SIGN_IN_URL:-/sign-in}" \
    --build-arg NEXT_PUBLIC_CLERK_SIGN_UP_URL="${NEXT_PUBLIC_CLERK_SIGN_UP_URL:-/sign-up}" \
    --build-arg NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="${NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL:-/properties}" \
    --build-arg NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="${NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL:-/properties}" \
    --build-arg NEXT_PUBLIC_API_PORT="${NEXT_PUBLIC_API_PORT:-8080}" \
    --build-arg NEXT_PUBLIC_API_BASE_PATH="${NEXT_PUBLIC_API_BASE_PATH:-/api/v1}" \
    --build-arg NEXT_PUBLIC_LOG_TOKENS="${NEXT_PUBLIC_LOG_TOKENS:-false}" \
    -t "${FULL_IMAGE_NAME}" \
    .

# Podman compatibility: alias under docker.io/library
# sudo docker tag "${FULL_IMAGE_NAME}" "docker.io/library/${FULL_IMAGE_NAME}" 2>/dev/null || true
# sudo docker rmi "localhost/${FULL_IMAGE_NAME}" 2>/dev/null || true

log_info "=========================================="
log_info "Image built: ${FULL_IMAGE_NAME}"
log_info "=========================================="
