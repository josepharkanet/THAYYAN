"""
Stonic Export API Tests
Tests for: Health check, Products CRUD, Categories, Auth, Contact, Settings
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from backend/.env
ADMIN_EMAIL = "shijo@stonic.export.com"
ADMIN_PASSWORD = "Asdf@1234&stonic"


class TestHealthCheck:
    """Health check endpoint tests"""
    
    def test_api_health(self):
        """Test API health endpoint returns running status"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert "Stonic Export" in data["message"]
        print("✓ API health check passed")


class TestCategories:
    """Categories endpoint tests"""
    
    def test_get_categories(self):
        """Test GET /api/categories returns list of categories"""
        response = requests.get(f"{BASE_URL}/api/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Verify category structure
        category = data[0]
        assert "id" in category
        assert "name" in category
        assert "description" in category
        print(f"✓ Categories API returned {len(data)} categories")


class TestProducts:
    """Products endpoint tests"""
    
    def test_get_all_products(self):
        """Test GET /api/products returns products list"""
        response = requests.get(f"{BASE_URL}/api/products")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Products API returned {len(data)} products")
    
    def test_get_products_by_category(self):
        """Test GET /api/products with category filter"""
        response = requests.get(f"{BASE_URL}/api/products?category=indian-marbles")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned products should be in the specified category
        for product in data:
            assert product["category"] == "indian-marbles"
        print(f"✓ Products filtered by category: {len(data)} products")
    
    def test_get_featured_products(self):
        """Test GET /api/products with featured filter"""
        response = requests.get(f"{BASE_URL}/api/products?featured=true")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        # All returned products should be featured
        for product in data:
            assert product["featured"] == True
        print(f"✓ Featured products: {len(data)} products")
    
    def test_get_single_product(self):
        """Test GET /api/products/{id} returns single product"""
        # First get all products to get a valid ID
        all_products = requests.get(f"{BASE_URL}/api/products").json()
        if len(all_products) == 0:
            pytest.skip("No products available for testing")
        
        product_id = all_products[0]["id"]
        response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == product_id
        assert "name" in data
        assert "category" in data
        assert "description" in data
        assert "image_url" in data
        print(f"✓ Single product retrieved: {data['name']}")
    
    def test_get_nonexistent_product(self):
        """Test GET /api/products/{id} returns 404 for invalid ID"""
        response = requests.get(f"{BASE_URL}/api/products/nonexistent-id-12345")
        assert response.status_code == 404
        print("✓ Nonexistent product returns 404")


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_login_success(self):
        """Test POST /api/auth/login with correct credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "id" in data
        print(f"✓ Login successful for {ADMIN_EMAIL}")
    
    def test_login_invalid_credentials(self):
        """Test POST /api/auth/login with wrong credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        data = response.json()
        assert "detail" in data
        print("✓ Invalid credentials return 401")
    
    def test_login_wrong_password(self):
        """Test POST /api/auth/login with correct email but wrong password"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Wrong password returns 401")
    
    def test_auth_me_with_valid_token(self):
        """Test GET /api/auth/me with valid token"""
        # First login to get token
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # Now test /auth/me
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        print("✓ Auth me endpoint works with valid token")
    
    def test_auth_me_without_token(self):
        """Test GET /api/auth/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ Auth me without token returns 401")
    
    def test_auth_me_with_invalid_token(self):
        """Test GET /api/auth/me with invalid token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid-token-12345"}
        )
        assert response.status_code == 401
        print("✓ Auth me with invalid token returns 401")


class TestContact:
    """Contact form endpoint tests"""
    
    def test_submit_contact_form(self):
        """Test POST /api/contact with valid data"""
        contact_data = {
            "name": f"TEST_User_{uuid.uuid4().hex[:8]}",
            "email": "test@example.com",
            "phone": "+91 9876543210",
            "message": "This is a test inquiry from automated testing."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == contact_data["name"]
        assert data["email"] == contact_data["email"]
        assert data["message"] == contact_data["message"]
        assert "id" in data
        assert "created_at" in data
        print(f"✓ Contact form submitted: {data['id']}")
    
    def test_submit_contact_form_without_phone(self):
        """Test POST /api/contact without optional phone field"""
        contact_data = {
            "name": f"TEST_User_{uuid.uuid4().hex[:8]}",
            "email": "test2@example.com",
            "message": "Test message without phone."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 200
        data = response.json()
        assert data["phone"] is None
        print("✓ Contact form works without phone")
    
    def test_submit_contact_form_invalid_email(self):
        """Test POST /api/contact with invalid email"""
        contact_data = {
            "name": "Test User",
            "email": "invalid-email",
            "message": "Test message"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=contact_data)
        assert response.status_code == 422  # Validation error
        print("✓ Invalid email returns 422")
    
    def test_get_contacts_requires_auth(self):
        """Test GET /api/contacts requires authentication"""
        response = requests.get(f"{BASE_URL}/api/contacts")
        assert response.status_code == 401
        print("✓ Get contacts requires auth")
    
    def test_get_contacts_with_auth(self):
        """Test GET /api/contacts with admin auth"""
        # Login first
        login_response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        token = login_response.json()["access_token"]
        
        response = requests.get(
            f"{BASE_URL}/api/contacts",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Admin can view contacts: {len(data)} contacts")


class TestSettings:
    """Site settings endpoint tests"""
    
    def test_get_settings(self):
        """Test GET /api/settings returns site settings"""
        response = requests.get(f"{BASE_URL}/api/settings")
        assert response.status_code == 200
        data = response.json()
        assert "hero_image" in data
        assert "about_image" in data
        assert "image_requirements" in data
        print("✓ Settings endpoint works")
    
    def test_get_image_requirements(self):
        """Test GET /api/settings/image-requirements"""
        response = requests.get(f"{BASE_URL}/api/settings/image-requirements")
        assert response.status_code == 200
        data = response.json()
        assert "hero_image" in data
        assert "product_main" in data
        print("✓ Image requirements endpoint works")


class TestProductCRUD:
    """Product CRUD operations (requires admin auth)"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code != 200:
            pytest.skip("Could not authenticate")
        return response.json()["access_token"]
    
    def test_create_product(self, auth_token):
        """Test POST /api/products creates new product"""
        product_data = {
            "name": f"TEST_Marble_{uuid.uuid4().hex[:8]}",
            "category": "indian-marbles",
            "description": "Test marble product for automated testing",
            "origin": "Test Origin",
            "finish": "Polished",
            "thickness": "20mm",
            "applications": ["Testing", "Automation"],
            "image_url": "https://example.com/test-image.jpg",
            "gallery_images": [],
            "featured": False
        }
        
        response = requests.post(
            f"{BASE_URL}/api/products",
            json=product_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == product_data["name"]
        assert data["category"] == product_data["category"]
        assert "id" in data
        
        # Verify product was created by fetching it
        get_response = requests.get(f"{BASE_URL}/api/products/{data['id']}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["name"] == product_data["name"]
        
        # Cleanup - delete the test product
        delete_response = requests.delete(
            f"{BASE_URL}/api/products/{data['id']}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert delete_response.status_code == 200
        print(f"✓ Product CRUD: Create, Read, Delete successful")
    
    def test_update_product(self, auth_token):
        """Test PUT /api/products/{id} updates product"""
        # First create a product
        product_data = {
            "name": f"TEST_Update_{uuid.uuid4().hex[:8]}",
            "category": "granite",
            "description": "Product to be updated",
            "image_url": "https://example.com/test.jpg"
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/products",
            json=product_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert create_response.status_code == 200
        product_id = create_response.json()["id"]
        
        # Update the product
        update_data = {"name": "TEST_Updated_Name", "featured": True}
        update_response = requests.put(
            f"{BASE_URL}/api/products/{product_id}",
            json=update_data,
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert update_response.status_code == 200
        updated = update_response.json()
        assert updated["name"] == "TEST_Updated_Name"
        assert updated["featured"] == True
        
        # Verify update persisted
        get_response = requests.get(f"{BASE_URL}/api/products/{product_id}")
        assert get_response.json()["name"] == "TEST_Updated_Name"
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/products/{product_id}",
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        print("✓ Product update successful")
    
    def test_create_product_requires_auth(self):
        """Test POST /api/products without auth returns 401"""
        product_data = {
            "name": "Unauthorized Product",
            "category": "granite",
            "description": "Should fail",
            "image_url": "https://example.com/test.jpg"
        }
        response = requests.post(f"{BASE_URL}/api/products", json=product_data)
        assert response.status_code == 401
        print("✓ Create product requires auth")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
