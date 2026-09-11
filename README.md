# Stonic Export

A modern, minimalist marble & natural-stone export website with a private admin
dashboard for managing all content.

- **Public site** — home, products (with category filters), product detail,
  services, about, contact. WhatsApp / call / email throughout.
- **Admin dashboard** (`/admin`) — Shijo signs in to add & edit products,
  categories, and all site content (hero, about, contact details, images).

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Database | SQLite + Prisma (one file, easy backups) |
| Auth | JWT cookie + bcrypt (single admin) |
| Images | Uploaded to a persistent volume, served via `/media/*` |
| Deploy | Docker (Coolify) |

---

## Local development

```bash
npm install
cp .env.example .env      # then edit values
npx prisma migrate deploy # create the SQLite dev database
npm run db:seed           # admin user + starter catalogue
npm run dev               # http://localhost:3000
```

Admin dashboard: <http://localhost:3000/admin> — sign in with the `ADMIN_EMAIL`
and `ADMIN_PASSWORD` from your `.env`.

Useful scripts:

```bash
npm run dev         # dev server
npm run build       # production build
npm run db:seed     # ensure admin user + seed starter content (idempotent)
npm run db:studio   # visual database browser
```

---

## Environment variables

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `file:/data/stonic.db` | SQLite path. Use the persistent volume in prod. |
| `UPLOAD_DIR` | `/data/uploads` | Where uploaded images are written. |
| `AUTH_SECRET` | *(long random string)* | Signs the admin cookie. `openssl rand -base64 48` |
| `ADMIN_EMAIL` | `shijo@stonicexport.com` | Created automatically on first run. |
| `ADMIN_PASSWORD` | *(strong password)* | Only used to create the admin on first run. |
| `ADMIN_NAME` | `Shijo Thayyil` | Display name. |
| `NEXT_PUBLIC_SITE_URL` | `https://www.stonicexport.com` | Used for SEO / sitemap. |

---

## Deploying on Coolify (KVM 4 VPS)

The app runs as **one container** with **one persistent volume** that holds both
the database and the uploaded images.

### 1. Create the application
1. Coolify → **New Resource → Application**.
2. Connect this Git repository.
3. **Build Pack: Dockerfile** (Coolify auto-detects the `Dockerfile`).
4. **Ports Exposes:** `3000`.

### 2. Add a persistent volume (important!)
Under the app's **Storages**, add a volume:
- **Name:** `stonic-data`
- **Mount Path:** `/data`

This is what keeps products, settings and uploaded photos safe across redeploys.

### 3. Set environment variables
Add these under **Environment Variables**:

```
DATABASE_URL=file:/data/stonic.db
UPLOAD_DIR=/data/uploads
AUTH_SECRET=<paste a long random string>
ADMIN_EMAIL=shijo@stonicexport.com
ADMIN_PASSWORD=<choose a strong password>
ADMIN_NAME=Shijo Thayyil
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Generate a secret locally with:

```bash
openssl rand -base64 48
```

### 4. Deploy
Click **Deploy**. On first boot the container automatically:
1. runs database migrations (creates the SQLite database),
2. creates the admin user and seeds the starter catalogue,
3. starts the site on port 3000.

### 5. Domain & SSL
Add your domain under **Domains**; Coolify issues an HTTPS certificate
automatically. Point your DNS `A` record at the VPS IP.

### 6. First login
Visit `https://your-domain.com/admin`, sign in, then replace the placeholder
product photos with real images and update the site content.

---

## Backups

Everything that matters lives in the `/data` volume:
- `stonic.db` — all products, categories and content
- `uploads/` — all uploaded images

Back up that single folder (Coolify scheduled backups, or `scp` it off the VPS)
and you can restore the entire site.

```bash
# Example: copy the data volume off the server
scp -r root@your-vps:/var/lib/docker/volumes/<stonic-data>/_data ./stonic-backup
```

---

## Updating content

Everything on the website is editable from **`/admin`** — no code changes or
redeploys needed:

- **Products** — add, edit, reorder, feature, delete; upload a main image + gallery.
- **Categories** — create/edit collections and their cover images.
- **Site Content** — hero, about story, statistics, contact details, social links.
