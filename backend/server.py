from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
from bson import ObjectId

ROOT_DIR = Path(__file__).parent

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

# Password hashing
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# JWT Token Management
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id, 
        "email": email, 
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60), 
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id, 
        "exp": datetime.now(timezone.utc) + timedelta(days=7), 
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth helper
async def get_current_user(request: Request) -> dict:
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
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {
            "id": str(user["_id"]),
            "email": user["email"],
            "name": user.get("name", ""),
            "role": user.get("role", "user")
        }
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

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

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

class ProductResponse(BaseModel):
    id: str
    name: str
    category: str
    description: str
    origin: Optional[str] = None
    finish: Optional[str] = None
    thickness: Optional[str] = None
    applications: List[str] = []
    image_url: str
    gallery_images: List[str] = []
    featured: bool = False
    created_at: str

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    created_at: str

# Site Settings for Images
class SiteSettingsUpdate(BaseModel):
    hero_image: Optional[str] = None
    about_image: Optional[str] = None
    logo_image: Optional[str] = None

class SiteSettingsResponse(BaseModel):
    hero_image: str
    about_image: str
    logo_image: str
    image_requirements: dict

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

# Categories
CATEGORIES = [
    {"id": "indian-marbles", "name": "Indian Marbles", "description": "Premium Indian marble in various shades and finishes"},
    {"id": "imported-marbles", "name": "Imported Marbles", "description": "High-quality imported marbles with unique patterns"},
    {"id": "granite", "name": "Granite", "description": "High-durability slabs for commercial and residential use"},
    {"id": "paving-stones", "name": "Paving & Natural Stones", "description": "Outdoor and landscaping stones"},
    {"id": "cobbles", "name": "Cobbles", "description": "Heavy-duty stones for driveways and pathways"},
    {"id": "artistic-handicrafts", "name": "Artistic Handicrafts", "description": "Custom-carved decorative works"},
    {"id": "cemetery-works", "name": "Cemetery Works", "description": "Bespoke memorials and tombstones"}
]

# Auth Routes
@api_router.post("/auth/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower()
    user = await db.users.find_one({"email": email})
    
    if not user or not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
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
async def logout(response: Response):
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# Product Routes
@api_router.get("/products", response_model=List[ProductResponse])
async def get_products(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/products", response_model=ProductResponse)
async def create_product(product: ProductCreate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    product_dict = product.model_dump()
    product_dict["id"] = str(uuid.uuid4())
    product_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.products.insert_one(product_dict)
    del product_dict["_id"]
    return product_dict

@api_router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product: ProductUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in product.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.products.update_one({"id": product_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated = await db.products.find_one({"id": product_id}, {"_id": 0})
    return updated

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    return {"message": "Product deleted successfully"}

# Categories
@api_router.get("/categories")
async def get_categories():
    return CATEGORIES

# Contact Routes
@api_router.post("/contact", response_model=ContactResponse)
async def create_contact(contact: ContactCreate):
    contact_dict = contact.model_dump()
    contact_dict["id"] = str(uuid.uuid4())
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.contacts.insert_one(contact_dict)
    del contact_dict["_id"]
    return contact_dict

@api_router.get("/contacts", response_model=List[ContactResponse])
async def get_contacts(request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return contacts

# Site Settings Routes
@api_router.get("/settings")
async def get_site_settings():
    settings = await db.site_settings.find_one({"type": "site"}, {"_id": 0})
    if not settings:
        settings = DEFAULT_SITE_SETTINGS.copy()
    settings["image_requirements"] = IMAGE_REQUIREMENTS
    return settings

@api_router.put("/settings")
async def update_site_settings(settings: SiteSettingsUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    await db.site_settings.update_one(
        {"type": "site"},
        {"$set": update_data},
        upsert=True
    )
    
    updated = await db.site_settings.find_one({"type": "site"}, {"_id": 0})
    updated["image_requirements"] = IMAGE_REQUIREMENTS
    return updated

@api_router.get("/settings/image-requirements")
async def get_image_requirements():
    return IMAGE_REQUIREMENTS

# Health check
@api_router.get("/")
async def root():
    return {"message": "Stonic Export API", "status": "running"}

# Include the router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Seed admin and sample products
async def seed_data():
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@stonicexport.com")
    admin_password = os.environ.get("ADMIN_PASSWORD", "StonicAdmin2024!")
    
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email, 
            "password_hash": hashed, 
            "name": "Admin", 
            "role": "admin", 
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info(f"Admin password updated: {admin_email}")
    
    # Seed sample products if none exist
    product_count = await db.products.count_documents({})
    if product_count == 0:
        sample_products = [
            {
                "id": str(uuid.uuid4()),
                "name": "Makrana White Marble",
                "category": "indian-marbles",
                "description": "Classic Indian white marble from Makrana with elegant grey veining. Perfect for flooring and countertops.",
                "origin": "Makrana, Rajasthan",
                "finish": "Polished",
                "thickness": "18-20mm",
                "applications": ["Flooring", "Countertops", "Wall Cladding"],
                "image_url": "https://images.unsplash.com/photo-1694378061058-bb6532de3bba?w=800",
                "gallery_images": [],
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Carrara White Marble",
                "category": "imported-marbles",
                "description": "Premium Italian Carrara marble known for its soft white background and delicate grey veining.",
                "origin": "Italy",
                "finish": "Polished",
                "thickness": "18-20mm",
                "applications": ["Flooring", "Countertops", "Bathrooms"],
                "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800",
                "gallery_images": [],
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Black Galaxy Granite",
                "category": "granite",
                "description": "Stunning black granite with golden flecks resembling a starry night sky.",
                "origin": "India",
                "finish": "Polished",
                "thickness": "20-30mm",
                "applications": ["Kitchen Counters", "Commercial Flooring", "Monuments"],
                "image_url": "https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/f11360bcab07e833ac42c1125d6072727a090078e13e0c7262e777b9a23c9a3c.png",
                "gallery_images": [],
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Kota Stone",
                "category": "paving-stones",
                "description": "Durable natural paving stone ideal for outdoor landscaping and pathways.",
                "origin": "Kota, Rajasthan",
                "finish": "Natural",
                "thickness": "25-50mm",
                "applications": ["Pathways", "Driveways", "Garden Landscaping"],
                "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                "gallery_images": [],
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Grey Cobblestones",
                "category": "cobbles",
                "description": "Premium grey cobblestones perfect for elegant driveways and courtyards.",
                "origin": "India",
                "finish": "Tumbled",
                "thickness": "40-60mm",
                "applications": ["Driveways", "Courtyards", "Walkways"],
                "image_url": "https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800",
                "gallery_images": [],
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Marble Fountain Sculpture",
                "category": "artistic-handicrafts",
                "description": "Exquisitely hand-carved marble fountain for luxury gardens and courtyards.",
                "origin": "India",
                "finish": "Polished",
                "thickness": "Custom",
                "applications": ["Gardens", "Hotels", "Public Spaces"],
                "image_url": "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800",
                "gallery_images": [],
                "featured": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Premium Memorial Stone",
                "category": "cemetery-works",
                "description": "High-precision carved memorial with custom designs available.",
                "origin": "India",
                "finish": "Mirror Polish",
                "thickness": "Custom",
                "applications": ["Memorials", "Gravestones", "Monuments"],
                "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
                "gallery_images": [],
                "featured": False,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.products.insert_many(sample_products)
        logger.info(f"Seeded {len(sample_products)} sample products")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    
    # Write test credentials
    creds_path = Path("/app/memory/test_credentials.md")
    creds_path.parent.mkdir(parents=True, exist_ok=True)
    with open(creds_path, "w") as f:
        f.write(f"# Test Credentials\n\n")
        f.write(f"## Admin\n")
        f.write(f"- Email: {admin_email}\n")
        f.write(f"- Password: {admin_password}\n")
        f.write(f"- Role: admin\n\n")
        f.write(f"## Auth Endpoints\n")
        f.write(f"- POST /api/auth/login\n")
        f.write(f"- POST /api/auth/logout\n")
        f.write(f"- GET /api/auth/me\n")

@app.on_event("startup")
async def startup_event():
    await seed_data()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
