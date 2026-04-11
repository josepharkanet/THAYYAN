from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from starlette.middleware.cors import CORSMiddleware
import pymysql
import pymysql.cursors
import os
import logging
import json
from pydantic import BaseModel, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# JWT Config
JWT_ALGORITHM = "HS256"

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

# MySQL connection helper
def get_db():
    return pymysql.connect(
        host=os.environ["DB_HOST"],
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        port=int(os.environ.get("DB_PORT", 3306)),
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )

# Password hashing
def hash_password(password):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def create_access_token(user_id, email):
    payload = {
        "sub": str(user_id),
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id):
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth helper
def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        conn = get_db()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT id, email, name, role FROM users WHERE id = %s", (payload["sub"],))
                user = cur.fetchone()
        finally:
            conn.close()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"id": str(user["id"]), "email": user["email"], "name": user["name"] or "", "role": user["role"]}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProductCreate(BaseModel):
    name: str
    category: str
    description: str
    origin: Optional[str] = None
    finish: Optional[str] = None
    thickness: Optional[str] = None
    applications: Optional[List[str]] = []
    image_url: str
    gallery_images: Optional[List[str]] = []
    featured: Optional[bool] = False

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    origin: Optional[str] = None
    finish: Optional[str] = None
    thickness: Optional[str] = None
    applications: Optional[List[str]] = None
    image_url: Optional[str] = None
    gallery_images: Optional[List[str]] = None
    featured: Optional[bool] = None

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class SiteSettingsUpdate(BaseModel):
    hero_image: Optional[str] = None
    about_image: Optional[str] = None
    logo_image: Optional[str] = None

# Default site images and requirements
DEFAULT_SITE_SETTINGS = {
    "hero_image": "https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png",
    "about_image": "https://customer-assets.emergentagent.com/job_design-preview-123/artifacts/yfzi6ael_image.png",
    "logo_image": ""
}

IMAGE_REQUIREMENTS = {
    "hero_image": {"width": 1920, "height": 1080, "description": "Homepage Hero Banner", "format": "JPG/PNG/WebP"},
    "about_image": {"width": 800, "height": 1000, "description": "About Page - Proprietor Photo", "format": "JPG/PNG"},
    "logo_image": {"width": 200, "height": 60, "description": "Site Logo (transparent PNG preferred)", "format": "PNG/SVG"},
    "product_main": {"width": 800, "height": 800, "description": "Product Main Image (Square)", "format": "JPG/PNG/WebP"},
    "product_gallery": {"width": 800, "height": 800, "description": "Product Gallery Images (Square)", "format": "JPG/PNG/WebP"},
    "category_image": {"width": 600, "height": 750, "description": "Category Card Image (4:5 ratio)", "format": "JPG/PNG/WebP"}
}

# Helper: get product with applications and gallery
def _format_product(product_row, conn):
    with conn.cursor() as cur:
        cur.execute("SELECT application FROM product_applications WHERE product_id = %s", (product_row["id"],))
        apps = [r["application"] for r in cur.fetchall()]
        cur.execute("SELECT image_url FROM product_gallery WHERE product_id = %s ORDER BY sort_order", (product_row["id"],))
        gallery = [r["image_url"] for r in cur.fetchall()]
    return {
        "id": product_row["id"],
        "name": product_row["name"],
        "category": product_row["category_id"],
        "description": product_row["description"] or "",
        "origin": product_row["origin"],
        "finish": product_row["finish"],
        "thickness": product_row["thickness"],
        "applications": apps,
        "image_url": product_row["image_url"],
        "gallery_images": gallery,
        "featured": bool(product_row["featured"]),
        "created_at": product_row["created_at"].isoformat() if product_row["created_at"] else ""
    }

# ========================
# AUTH ROUTES
# ========================
@api_router.post("/auth/login")
def login(request_body: LoginRequest, response: Response):
    email = request_body.email.lower()
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cur.fetchone()
    finally:
        conn.close()
    if not user or not verify_password(request_body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user_id = str(user["id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    response.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return {
        "id": user_id,
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
        "access_token": access_token
    }

@api_router.post("/auth/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
def get_me(request: Request):
    return get_current_user(request)

# ========================
# PRODUCT ROUTES
# ========================
@api_router.get("/products")
def get_products(category: Optional[str] = None, featured: Optional[bool] = None):
    conn = get_db()
    try:
        query = "SELECT * FROM products WHERE 1=1"
        params = []
        if category:
            query += " AND category_id = %s"
            params.append(category)
        if featured is not None:
            query += " AND featured = %s"
            params.append(featured)
        query += " ORDER BY created_at DESC"
        with conn.cursor() as cur:
            cur.execute(query, params)
            rows = cur.fetchall()
        return [_format_product(r, conn) for r in rows]
    finally:
        conn.close()

@api_router.get("/products/{product_id}")
def get_product(product_id: str):
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        return _format_product(row, conn)
    finally:
        conn.close()

@api_router.post("/products")
def create_product(product: ProductCreate, request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    product_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO products (id, name, category_id, description, origin, finish, thickness, image_url, featured, created_at) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                (product_id, product.name, product.category, product.description, product.origin, product.finish, product.thickness, product.image_url, product.featured, now)
            )
            for app_name in (product.applications or []):
                cur.execute("INSERT INTO product_applications (product_id, application) VALUES (%s, %s)", (product_id, app_name))
            for img_url in (product.gallery_images or []):
                cur.execute("INSERT INTO product_gallery (product_id, image_url) VALUES (%s, %s)", (product_id, img_url))
            cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            row = cur.fetchone()
        return _format_product(row, conn)
    finally:
        conn.close()

@api_router.put("/products/{product_id}")
def update_product(product_id: str, product: ProductUpdate, request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    update_data = {k: v for k, v in product.model_dump().items() if v is not None and k not in ("applications", "gallery_images")}
    if "category" in update_data:
        update_data["category_id"] = update_data.pop("category")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM products WHERE id = %s", (product_id,))
            if not cur.fetchone():
                raise HTTPException(status_code=404, detail="Product not found")
            if update_data:
                set_clause = ", ".join(f"{k} = %s" for k in update_data)
                cur.execute(f"UPDATE products SET {set_clause} WHERE id = %s", (*update_data.values(), product_id))
            if product.applications is not None:
                cur.execute("DELETE FROM product_applications WHERE product_id = %s", (product_id,))
                for app_name in product.applications:
                    cur.execute("INSERT INTO product_applications (product_id, application) VALUES (%s, %s)", (product_id, app_name))
            if product.gallery_images is not None:
                cur.execute("DELETE FROM product_gallery WHERE product_id = %s", (product_id,))
                for img_url in product.gallery_images:
                    cur.execute("INSERT INTO product_gallery (product_id, image_url) VALUES (%s, %s)", (product_id, img_url))
            cur.execute("SELECT * FROM products WHERE id = %s", (product_id,))
            row = cur.fetchone()
        return _format_product(row, conn)
    finally:
        conn.close()

@api_router.delete("/products/{product_id}")
def delete_product(product_id: str, request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Product not found")
    finally:
        conn.close()
    return {"message": "Product deleted successfully"}

# ========================
# CATEGORIES
# ========================
@api_router.get("/categories")
def get_categories():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, description FROM categories ORDER BY sort_order")
            return cur.fetchall()
    finally:
        conn.close()

# ========================
# CONTACT ROUTES
# ========================
@api_router.post("/contact")
def create_contact(contact: ContactCreate):
    contact_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO contacts (id, name, email, phone, message, created_at) VALUES (%s,%s,%s,%s,%s,%s)",
                (contact_id, contact.name, contact.email, contact.phone, contact.message, now)
            )
    finally:
        conn.close()
    return {"id": contact_id, "name": contact.name, "email": contact.email, "phone": contact.phone, "message": contact.message, "created_at": now.isoformat()}

@api_router.get("/contacts")
def get_contacts(request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC")
            rows = cur.fetchall()
        return [{"id": r["id"], "name": r["name"], "email": r["email"], "phone": r["phone"], "message": r["message"], "created_at": r["created_at"].isoformat() if r["created_at"] else ""} for r in rows]
    finally:
        conn.close()

# ========================
# SITE SETTINGS
# ========================
@api_router.get("/settings")
def get_site_settings():
    conn = get_db()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT setting_key, setting_value FROM site_settings")
            rows = cur.fetchall()
        settings = {r["setting_key"]: r["setting_value"] or "" for r in rows}
        result = {
            "hero_image": settings.get("hero_image", DEFAULT_SITE_SETTINGS["hero_image"]),
            "about_image": settings.get("about_image", DEFAULT_SITE_SETTINGS["about_image"]),
            "logo_image": settings.get("logo_image", DEFAULT_SITE_SETTINGS["logo_image"]),
            "image_requirements": IMAGE_REQUIREMENTS
        }
        return result
    finally:
        conn.close()

@api_router.put("/settings")
def update_site_settings(settings: SiteSettingsUpdate, request: Request):
    user = get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    conn = get_db()
    try:
        with conn.cursor() as cur:
            for key, value in update_data.items():
                cur.execute(
                    "INSERT INTO site_settings (setting_key, setting_value) VALUES (%s, %s) ON DUPLICATE KEY UPDATE setting_value = %s",
                    (key, value, value)
                )
    finally:
        conn.close()
    return get_site_settings()

@api_router.get("/settings/image-requirements")
def get_image_requirements():
    return IMAGE_REQUIREMENTS

# Health check
@api_router.get("/")
def root():
    return {"message": "Stonic Export API", "status": "running"}

# Include the router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
