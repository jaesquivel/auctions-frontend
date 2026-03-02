#!/bin/bash
# release.sh <version>
# Merges dev into main and creates a release tag.
#
# Usage:
#   ./release.sh 1.2.0

set -e

# ============================================
# COLORS
# ============================================
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log_info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================
# ARGS
# ============================================
VERSION="${1}"
if [ -z "${VERSION}" ]; then
    log_error "Version is required."
    echo "Usage: ./release.sh <version>"
    echo "       ./release.sh 1.2.0"
    exit 1
fi

TAG="v${VERSION}"

# ============================================
# PRE-FLIGHT
# ============================================
ORIGINAL_BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ -n "$(git status --porcelain)" ]; then
    log_error "Working tree is not clean. Commit or stash changes first."
    exit 1
fi

if git tag | grep -q "^${TAG}$"; then
    log_error "Tag ${TAG} already exists."
    exit 1
fi

# ============================================
# MERGE & TAG
# ============================================
log_info "Checking out main..."
git checkout main

log_info "Merging dev into main..."
git merge dev --no-ff -m "chore: merge dev into main for ${TAG} release"

log_info "Tagging ${TAG}..."
git tag "${TAG}" -m "Release ${TAG}"

log_info "Pushing main and tag to origin..."
git push origin main
git push origin "${TAG}"

log_info "Returning to ${ORIGINAL_BRANCH}..."
git checkout "${ORIGINAL_BRANCH}"

log_info "=========================================="
log_info "Release ${TAG} pushed to origin/main."
log_info "Next: ./build.sh ${VERSION}"
log_info "=========================================="
