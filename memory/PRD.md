# Stonic Export - PRD

## Original Problem Statement
Build a luxury natural stone website for Stonic Export (inspired by marblecentre.in) with admin panel, services page, WhatsApp integration, contact form, and luxury stone-inspired design.

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn UI, React Router, Axios, React Helmet
- Backend: FastAPI (Python), MongoDB
- Database Schema: MySQL export (`database.sql`) for Host Armada deployment
- Package Manager: npm (standardized)

## Implemented Features (Complete)
- Full product catalog with CRUD (7 categories, 7+ products)
- Admin panel (Dashboard, Products, Contacts, Settings)
- JWT Authentication (sessionStorage + httpOnly cookies)
- WhatsApp integration on all product pages
- Contact form with backend storage
- SEO tags via react-helmet-async
- Site settings management (hero image, about image, logo)
- Services page with specialized services
- About page with proprietor info
- MySQL schema export (`database.sql`)
- Host Armada deployment files (README, .env.example, .htaccess guide)
- Code quality fixes (hook dependencies, array keys, sessionStorage security)
- **Repo cleanup** (Apr 2026): Removed Emergent-platform deps, unused Shadcn components, PostHog analytics, standardized on npm, verified build works

## Admin Credentials
- Email: shijo@stonic.export.com
- Password: Asdf@1234&stonic

## API Endpoints
- POST /api/auth/login, /api/auth/logout
- GET /api/auth/me
- GET/POST/PUT/DELETE /api/products
- GET /api/categories
- POST /api/contact | GET /api/contacts (admin)
- GET/PUT /api/settings

## Deployment Target
- Host Armada (shared hosting with MySQL + File Manager)
- GitHub repo: josepharkanet/THAYYAN

## Testing
- Regression test passed 100% (23/23 backend, all frontend pages)
- Build verified: `npm install && npm run build` succeeds cleanly
