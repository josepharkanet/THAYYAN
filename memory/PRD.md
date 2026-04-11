# Stonic Export - PRD

## Original Problem Statement
Luxury natural stone website for Stonic Export (inspired by marblecentre.in). Admin panel, products, services, WhatsApp, contact form. Deploy on Host Armada shared hosting.

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn UI
- Backend: PHP API (no Python needed)
- Database: MySQL (Host Armada cPanel)

## Implemented Features
- Full product catalog with CRUD (7 categories)
- Admin panel (Dashboard, Products, Contacts, Settings)
- JWT Authentication
- WhatsApp integration
- Contact form
- SEO tags via react-helmet-async
- PHP backend connecting to MySQL (converted from Python/MongoDB)
- database.sql with seed data

## Admin Credentials
- Email: shijo@stonic.export.com
- Password: Asdf@1234&stonic

## Deployment: Host Armada
1. Import database.sql via phpMyAdmin
2. Edit api/config.php with DB credentials
3. Build frontend: cd frontend && npm install && npm run build
4. Upload build/ contents + api/ folder to public_html
5. Create .htaccess in public_html (see README)
