# Stonic Export - Premium Indian Natural Stones

A modern, SEO-friendly website for Stonic Export - India's premier source for luxury natural stones including Marble, Granite, Paving Stones, Cobbles, and Artistic Handicrafts.

![Stonic Export](https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png)

## Features

- **Product Catalog** - 7 categories with multiple products each
- **SEO Optimized** - Individual product pages with meta tags, Open Graph, and JSON-LD
- **Admin Panel** - Manage products, categories, contacts, and site settings
- **WhatsApp Integration** - Direct inquiry buttons on all products
- **Responsive Design** - Mobile-first, works on all devices
- **Contact Form** - Captures leads with admin notification

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Shadcn UI Components
- React Router
- Axios
- React Helmet (SEO)

### Backend (Original)
- FastAPI (Python)
- MongoDB
- JWT Authentication

### Database (For Hostinger)
- MySQL 8.0+
- See `database.sql` for schema

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MySQL database (for production)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/stonic-export.git
cd stonic-export

# Install frontend dependencies
cd frontend
npm install

# Build for production
npm run build
```

### Development

```bash
cd frontend
npm start
```

The app will run at `http://localhost:3000`

---

## Deployment Guide

### Option 1: Hostinger Shared Hosting (Frontend Only)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to Hostinger:**
   - Go to File Manager in hPanel
   - Navigate to `public_html`
   - Upload all contents from `frontend/build/` folder
   - Upload `.htaccess` file (see below)

3. **Create `.htaccess` in public_html:**
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

### Option 2: Full Stack Deployment

For the backend, you'll need:
- **VPS/Cloud hosting** (Railway, Render, DigitalOcean) for Python/FastAPI
- **Or convert to PHP** for Hostinger shared hosting

---

## Database Setup (MySQL)

### 1. Create Database in phpMyAdmin

1. Log in to Hostinger hPanel
2. Go to **Databases** → **MySQL Databases**
3. Create a new database (e.g., `stonic_export`)
4. Create a database user and assign to the database

### 2. Import Schema

1. Go to **phpMyAdmin**
2. Select your database
3. Click **Import**
4. Upload `database.sql`
5. Click **Go**

### 3. Database Tables

| Table | Description |
|-------|-------------|
| `users` | Admin authentication |
| `categories` | Product categories |
| `products` | Main products table |
| `product_applications` | Product usage types |
| `product_gallery` | Additional product images |
| `contacts` | Contact form submissions |
| `site_settings` | Site configuration |

---

## Admin Panel

**URL:** `https://yourdomain.com/admin/login`

**Default Credentials:**
- Email: `shijo@stonic.export.com`
- Password: `Asdf@1234&stonic`

### Admin Features:
- Dashboard with stats
- Product management (CRUD)
- Contact inquiries
- Site settings (images, etc.)

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DB_HOST=localhost
DB_NAME=stonic_export
DB_USER=your_user
DB_PASSWORD=your_password

# App
REACT_APP_BACKEND_URL=https://yourdomain.com/api
```

---

## Folder Structure

```
stonic-export/
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/            # API utilities
│   │   └── pages/          # Page components
│   ├── package.json
│   └── build/              # Production build
├── backend/                # FastAPI backend
│   ├── server.py
│   └── requirements.txt
├── dist/                   # Production-ready files
├── database.sql            # MySQL schema
├── .env.example            # Environment template
└── README.md
```

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

## SEO Features

- **Meta Tags** - Title, description, keywords per page
- **Open Graph** - Facebook/social sharing
- **Twitter Cards** - Twitter sharing optimization
- **JSON-LD** - Structured data for products
- **Canonical URLs** - Prevent duplicate content
- **Semantic HTML** - Proper heading hierarchy

---

## Contact Information

**Stonic Export**
- **Proprietor:** Shijo Thayyil
- **Phone:** +91 9544982471, +91 7559912233
- **Email:** info@stonicexport.com
- **Website:** www.stonicexport.com

---

## License

This project is proprietary software for Stonic Export.

---

## Support

For technical support, contact the development team.
