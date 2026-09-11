# CLAUDE.md — Stonic Export

Project notes for AI assistants working in this repo.

## What this is
Marble/natural-stone **export company website** (Stonic Export, proprietor Shijo
Thayyil) + a private **admin dashboard** so Shijo can manage all content himself.
Rebuild of an older React/PHP site. Hosted on a Hostinger **KVM 4 VPS via Coolify**.

## Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4 (tokens in `src/app/globals.css` `@theme`; no tailwind.config)
- Prisma + **SQLite** (`prisma/schema.prisma`)
- Custom auth: `jose` JWT in an httpOnly cookie + `bcryptjs`
- Image uploads to a local dir (`UPLOAD_DIR`), served by `src/app/media/[...file]`

## Layout
```
src/app/(site)/…        Public pages (force-dynamic; read DB + settings)
src/app/admin/login     Login (public)
src/app/admin/(dashboard)/…  Protected dashboard (requireSession in its layout)
src/app/admin/actions.ts     Server actions (login/logout, product/category/settings CRUD)
src/app/api/admin/upload     Image upload endpoint (checks session)
src/lib/db.ts           Prisma singleton
src/lib/session.ts      Edge-safe JWT helpers (used by middleware)
src/lib/auth.ts         Node auth helpers (bcrypt, cookies, getSession/requireSession)
src/lib/settings.ts     SETTING_DEFAULTS + getSettings() (DB overrides over defaults)
src/lib/content.ts      Static editorial content (services, values)
src/middleware.ts       Protects /admin (except /admin/login)
```

## Design system
Warm stone palette + sage accent; Cormorant Garamond (serif headings) + Manrope
(sans). Tokens: `paper`, `ink`, `ink-2/3`, `line`, `sage`, `sage-soft`, `whatsapp`.
Utilities in globals.css: `.eyebrow`, `.reveal` (scroll reveal via `Reveal.tsx`),
`.glass`, `.link-underline`, `.wa-pulse`.

## Content model
- `Category` (id = slug), `Product` (slug unique, `applications` = JSON string,
  `gallery` = ProductImage[]), `Setting` (key/value), `User` (admin).
- Editable site copy lives in `Setting` rows layered over `SETTING_DEFAULTS`.

## Conventions / gotchas
- Data pages are `export const dynamic = "force-dynamic"` so the build never
  needs a DB and admin edits show immediately. Mutations call `revalidatePath("/","layout")`.
- **TypeScript is pinned to 5.x** — TS 7 breaks Next's config loader.
- **lucide-react v1 removed brand logos** — Instagram/Facebook/WhatsApp are inline
  SVGs in `src/components/site/icons.tsx`.
- `next.config.mjs` (not .ts) so production `next start` needs no TypeScript.
- Uploaded images are referenced as `/media/<file>` and read from `UPLOAD_DIR`.

## Deploy
Docker (`Dockerfile` + `docker-entrypoint.sh`). One container + one volume at
`/data` (SQLite `stonic.db` + `uploads/`). Startup runs `prisma migrate deploy`
then the idempotent `prisma/seed.ts` (seeds sample content only into an empty DB;
always ensures the admin user). See `README.md` for the full Coolify guide.

## Local dev
`npm install && npx prisma migrate deploy && npm run db:seed && npm run dev`
Dev admin (from `.env`): shijo@stonicexport.com / Stonic@2026
