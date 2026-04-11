# Stonic Export - Premium Indian Natural Stones

## Host Armada Deployment Guide

### Architecture
```
yourdomain.com          → Frontend (React static files in public_html)
api.yourdomain.com      → Backend (Python FastAPI + MySQL)
```

---

## Step 1: Set Up MySQL Database

1. In cPanel → **MySQL Databases** → Create database (e.g., `stonic_export`)
2. Create a database user → Assign **ALL PRIVILEGES** to the database
3. Go to **phpMyAdmin** → Select your database → **Import** tab
4. Upload `database.sql` → Click **Go**

This creates all tables and seeds: admin user, 7 categories, 7 sample products, site settings.

---

## Step 2: Deploy Backend (Python API)

### 2a. Create a Subdomain
1. In cPanel → **Domains** or **Subdomains**
2. Create: `api.yourdomain.com`

### 2b. Create Python App
1. In cPanel → **Software** → **Setup Python App**
2. Click **Create Application**:
   - **Python version**: 3.11 (or latest available)
   - **Application root**: `api` (or `python_api`)
   - **Application URL**: `api.yourdomain.com`
   - **Application startup file**: `passenger_wsgi.py`
   - **Application entry point**: `application`
3. Click **CREATE**

### 2c. Upload Backend Files
Upload these files from `backend/` folder to the Application root directory:
- `server.py`
- `passenger_wsgi.py`
- `requirements.txt`
- `.env` (create from `.env.example` with your real MySQL credentials)

### 2d. Create `.env` in the Application root
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_cpanel_database_name
DB_USER=your_cpanel_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=any_random_string_at_least_32_characters_long
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 2e. Install Dependencies
1. In **Setup Python App**, click the **pencil icon** to edit your app
2. In **Configuration files**, add `requirements.txt`
3. Click **Run Pip Install**
4. OR use SSH/Terminal:
```bash
source /home/username/virtualenv/api/3.11/bin/activate
cd ~/api
pip install -r requirements.txt
```

### 2f. Restart the App
Click **Restart** in Setup Python App.

### 2g. Test
Visit `https://api.yourdomain.com/api/` — you should see:
```json
{"message": "Stonic Export API", "status": "running"}
```

---

## Step 3: Deploy Frontend

### 3a. Set the Backend URL
Before building, create `frontend/.env`:
```env
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

### 3b. Build
```bash
cd frontend
npm install
npm run build
```

### 3c. Upload to Host Armada
1. Go to **File Manager** → `public_html`
2. Delete any default files
3. Upload **everything inside** `frontend/build/` into `public_html`

### 3d. Create `.htaccess` in `public_html`
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

---

## Admin Panel

**URL:** `https://yourdomain.com/admin/login`

**Default Credentials:**
- Email: `shijo@stonic.export.com`
- Password: `Asdf@1234&stonic`

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin login shows blank page | Backend not running. Check `https://api.yourdomain.com/api/` |
| 404 on page refresh | `.htaccess` missing in `public_html` |
| CORS errors in console | Update `CORS_ORIGINS` in backend `.env` with your exact domain |
| API returns 500 | Check Python app error logs in cPanel → Setup Python App |
| Database connection failed | Verify DB credentials in backend `.env` match cPanel MySQL settings |

---

## File Reference

| File | Purpose |
|------|---------|
| `database.sql` | MySQL schema — import into phpMyAdmin |
| `backend/server.py` | FastAPI backend (MySQL) |
| `backend/passenger_wsgi.py` | cPanel Passenger entry point |
| `backend/requirements.txt` | Python dependencies |
| `backend/.env.example` | Backend env template |
| `frontend/.env.example` | Frontend env template |
| `frontend/` | React source code |

---

## Contact
**Stonic Export** — Shijo Thayyil
- Phone: +91 9544982471, +91 7559912233
- Email: info@stonicexport.com
