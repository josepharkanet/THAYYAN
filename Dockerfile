# syntax=docker/dockerfile:1

# ───────────────────────────── Base ─────────────────────────────
# Debian slim (not Alpine) so Prisma's query engine + OpenSSL work cleanly.
FROM node:22-bookworm-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ────────────────────────── Dependencies ────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ──────────────────────────── Builder ───────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# A throwaway DB URL just so `prisma generate` is happy; the build itself
# never queries the database (all data pages are server-rendered on demand).
ENV DATABASE_URL="file:/tmp/build.db"
RUN npm run build

# ──────────────────────────── Runner ────────────────────────────
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
# Everything needed to run the app AND to migrate/seed on startup.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
