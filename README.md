# Stonic Export - Premium Indian Natural Stones

## Host Armada Deployment Guide (No Python needed!)

Everything runs on Host Armada's shared hosting using **PHP + MySQL**.

---

## What You'll Upload

```
public_html/
├── index.html          ← From frontend/build/
├── static/             ← From frontend/build/
├── asset-manifest.json ← From frontend/build/
├── .htaccess           ← Create this (see below)
└── api/                ← Upload the api/ folder as-is
    ├── .htaccess
    ├── index.php
    ├── config.php      ← Edit DB credentials here
    └── routes/
        ├── auth.php
        ├── products.php
        ├── categories.php
        ├── contacts.php
        └── settings.php
```

---

## Step 1: Set Up MySQL Database

1. cPanel → **MySQL Databases** → Create database (e.g., `stonic_export`)
2. Create a database user → Assign **ALL PRIVILEGES**
3. cPanel → **phpMyAdmin** → Select your database → **Import**
4. Upload `database.sql` → Click **Go**

This creates all tables + seeds admin user, categories, and sample products.

---

## Step 2: Configure the PHP API

Open `api/config.php` and update **lines 3-5** with your Host Armada MySQL credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_database_name');  // e.g., username_stonic
define('DB_USER', 'your_cpanel_db_user');         // e.g., username_dbuser
define('DB_PASS', 'your_database_password');
```

Also update **line 8** with your domain:
```php
define('FRONTEND_URL', 'https://yourdomain.com');
```

And **line 11** — change the JWT secret to any random string:
```php
define('JWT_SECRET', 'any_random_string_here_make_it_long');
```

---

## Step 3: Build the Frontend

On your PC:

```bash
cd frontend
```

Create a file called `.env` inside the `frontend` folder:
```
REACT_APP_BACKEND_URL=https://yourdomain.com
```

Then build:
```bash
npm install
npm run build
```

---

## Step 4: Upload Everything to Host Armada

1. cPanel → **File Manager** → Go to `public_html`
2. Delete any default files (like `index.html` from cPanel)
3. Upload **all contents** from `frontend/build/` into `public_html`
4. Upload the **entire `api/` folder** into `public_html` (so it sits at `public_html/api/`)

---

## Step 5: Create `.htaccess` in `public_html`

Create a new file `.htaccess` in `public_html` (NOT inside `api/`):

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Don't rewrite API requests - let them go to api/ folder
  RewriteRule ^api/ - [L]

  # Don't rewrite actual files
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l

  # Send everything else to React
  RewriteRule . /index.html [L]
</IfModule>
```

> **Important:** The `api/` folder already has its own `.htaccess` — don't modify that one.

---

## Step 6: Test

1. Visit `https://yourdomain.com` → Should show your website
2. Visit `https://yourdomain.com/api/` → Should show `{"message":"Stonic Export API","status":"running"}`
3. Visit `https://yourdomain.com/admin/login` → Login with:
   - **Email:** `shijo@stonic.export.com`
   - **Password:** `Asdf@1234&stonic`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API returns blank page | Check `config.php` DB credentials match cPanel MySQL |
| 500 error on API | cPanel → Error Logs. Usually wrong DB credentials |
| Login fails | Re-import `database.sql` (the password hash might be wrong). Or check CORS in `config.php` |
| 404 on page refresh | `.htaccess` missing or wrong in `public_html` |
| Admin page blank after login | API not responding. Test `yourdomain.com/api/` first |

---

## Admin Panel

- **URL:** `https://yourdomain.com/admin/login`
- **Email:** `shijo@stonic.export.com`
- **Password:** `Asdf@1234&stonic`

---

## File Reference

| File | Purpose |
|------|---------|
| `database.sql` | Import into phpMyAdmin — creates all tables + seed data |
| `api/config.php` | Database credentials + JWT secret — **EDIT THIS** |
| `api/index.php` | API router |
| `api/routes/*.php` | API endpoints (auth, products, contacts, settings) |
| `frontend/` | React source code (build locally, upload `build/`) |
