#!/bin/sh
set -e

# Ensure the data + uploads directories exist (these live on the mounted volume).
mkdir -p "${UPLOAD_DIR:-/data/uploads}"

echo "→ Applying database migrations..."
./node_modules/.bin/prisma migrate deploy

echo "→ Ensuring admin user & seeding starter content (only if empty)..."
./node_modules/.bin/tsx prisma/seed.ts || echo "⚠  Seed step skipped (continuing)."

echo "→ Starting Stonic Export on port ${PORT:-3000}..."
exec ./node_modules/.bin/next start -p "${PORT:-3000}" -H 0.0.0.0
