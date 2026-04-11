# Stonic Export - Premium Indian Natural Stones

A modern, SEO-friendly website for Stonic Export - India's premier source for luxury natural stones including Marble, Granite, Paving Stones, Cobbles, and Artistic Handicrafts.

## Features

- **Product Catalog** - 7 categories with multiple products each
- **SEO Optimized** - Individual product pages with meta tags, Open Graph, and JSON-LD
- **Admin Panel** - Manage products, categories, contacts, and site settings
- **WhatsApp Integration** - Direct inquiry buttons on all products
- **Responsive Design** - Mobile-first, works on all devices
- **Contact Form** - Captures leads with admin notification

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Shadcn UI Components
- React Router
- Axios
- React Helmet (SEO)

### Database
- MySQL 8.0+
- See `database.sql` for schema

---

## Host Armada Deployment Guide

### Step 1: Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `build/` folder with all production-ready static files.

### Step 2: Upload to Host Armada File Manager

1. Log in to your **Host Armada cPanel**
2. Open **File Manager**
3. Navigate to `public_html`
4. Upload **all contents** from `frontend/build/` folder into `public_html`
5. Create an `.htaccess` file in `public_html` with the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

> This `.htaccess` ensures React Router works properly - all routes are redirected to `index.html`.

### Step 3: Set Up MySQL Database

1. In cPanel, go to **MySQL Databases**
2. Create a new database (e.g., `stonic_export`)
3. Create a database user and assign it full privileges to the database
4. Open **phpMyAdmin**
5. Select your database
6. Click **Import** tab
7. Choose `database.sql` file and click **Go**

This will create all tables and seed default data including:
- Admin user (`shijo@stonic.export.com`)
- 7 product categories
- 7 sample products
- Default site settings

### Step 4: Set Up Environment

Copy `.env.example` to `.env` and update with your Host Armada details:

```env
DB_HOST=localhost
DB_NAME=your_cpanel_database_name
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_db_password
REACT_APP_BACKEND_URL=https://yourdomain.com
JWT_SECRET=your_secure_random_string
```

---

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | Admin authentication |
| `categories` | Product categories (7 default) |
| `products` | Main products table |
| `product_applications` | Product usage types (many-to-many) |
| `product_gallery` | Additional product images |
| `contacts` | Contact form submissions |
| `site_settings` | Site configuration (images, contact info) |

---

## Admin Panel

**URL:** `https://yourdomain.com/admin/login`

**Default Credentials:**
- Email: `shijo@stonic.export.com`
- Password: `Asdf@1234&stonic`

### Admin Features:
- Dashboard with stats
- Product management (Add/Edit/Delete)
- Contact inquiries viewer
- Site settings (Hero image, About image, Logo)

---

## Product Categories

1. Indian Marbles
2. Imported Marbles
3. Granite
4. Paving & Natural Stones
5. Cobbles
6. Artistic Handicrafts
7. Cemetery Works

---

## Image Requirements

| Image Type | Resolution | Format |
|------------|------------|--------|
| Hero Banner | 1920 x 1080px | JPG/PNG/WebP |
| About Image | 800 x 1000px | JPG/PNG |
| Site Logo | 200 x 60px | PNG/SVG |
| Product Main | 800 x 800px | JPG/PNG/WebP |
| Product Gallery | 800 x 800px | JPG/PNG/WebP |
| Category Image | 600 x 750px | JPG/PNG/WebP |

---

## Folder Structure

```
THAYYAN/
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI components (Shadcn)
│   │   ├── contexts/       # Auth context
│   │   ├── lib/            # API utilities
│   │   └── pages/          # Page components
│   ├── package.json
│   └── build/              # Production build (after npm run build)
├── backend/                # FastAPI backend (Python/MongoDB)
│   ├── server.py
│   └── requirements.txt
├── database.sql            # MySQL schema - IMPORT THIS
├── .env.example            # Environment template
└── README.md
```

---

## SEO Features

- Meta Tags (title, description, keywords per page)
- Open Graph (Facebook/social sharing)
- Twitter Cards
- JSON-LD (structured data for products)
- Canonical URLs
- Semantic HTML with proper heading hierarchy

---

## Contact Information

**Stonic Export**
- **Proprietor:** Shijo Thayyil
- **Phone:** +91 9544982471, +91 7559912233
- **Email:** info@stonicexport.com
- **WhatsApp:** +91 9544982471

---

## License

This project is proprietary software for Stonic Export.
