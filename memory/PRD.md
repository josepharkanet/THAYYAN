# Stonic Export - PRD

## Original Problem Statement
Build a luxury natural stone website for Stonic Export (inspired by marblecentre.in) with admin panel, services page, WhatsApp integration, contact form, and luxury stone-inspired design. Deploy on Host Armada shared hosting.

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn UI, React Router, Axios, React Helmet
- Backend: FastAPI (Python) with MySQL via PyMySQL
- Database: MySQL (Host Armada cPanel)
- Deployment: cPanel Python App (Passenger WSGI) + static frontend in public_html

## Implemented Features (Complete)
- Full product catalog with CRUD (7 categories)
- Admin panel (Dashboard, Products, Contacts, Settings)
- JWT Authentication (sessionStorage + httpOnly cookies)
- WhatsApp integration on all product pages
- Contact form with backend storage
- SEO tags via react-helmet-async
- Site settings management
- Services page, About page
- MySQL backend (converted from MongoDB) with passenger_wsgi.py for cPanel
- database.sql for phpMyAdmin import
- Clean npm-based build (no Emergent platform deps)

## Admin Credentials
- Email: shijo@stonic.export.com
- Password: Asdf@1234&stonic

## Deployment Target
- Host Armada shared hosting (cPanel)
- GitHub repo: josepharkanet/THAYYAN
