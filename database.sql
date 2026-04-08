-- =====================================================
-- STONIC EXPORT DATABASE SCHEMA
-- MySQL Database for Hostinger
-- =====================================================

-- Create Database (if needed)
-- CREATE DATABASE IF NOT EXISTS stonic_export CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE stonic_export;

-- =====================================================
-- USERS TABLE (Admin Authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL DEFAULT 'Admin',
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    description TEXT,
    origin VARCHAR(100),
    finish VARCHAR(100),
    thickness VARCHAR(50),
    image_url VARCHAR(500) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category_id),
    INDEX idx_featured (featured),
    INDEX idx_name (name),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRODUCT APPLICATIONS TABLE (Many-to-Many relationship)
-- =====================================================
CREATE TABLE IF NOT EXISTS product_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    application VARCHAR(100) NOT NULL,
    INDEX idx_product (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PRODUCT GALLERY IMAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS product_gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id),
    INDEX idx_sort (sort_order),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CONTACTS TABLE (Contact Form Submissions)
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SITE SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Default Admin User (Password: Asdf@1234&stonic)
-- Note: You need to hash this password with bcrypt in your PHP backend
INSERT INTO users (email, password_hash, name, role) VALUES 
('shijo@stonic.export.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VttYD/qKIjL7Wy', 'Shijo Thayyil', 'admin')
ON DUPLICATE KEY UPDATE name = 'Shijo Thayyil';

-- Default Categories
INSERT INTO categories (id, name, description, sort_order) VALUES 
('indian-marbles', 'Indian Marbles', 'Premium Indian marble in various shades and finishes', 1),
('imported-marbles', 'Imported Marbles', 'High-quality imported marbles with unique patterns', 2),
('granite', 'Granite', 'High-durability slabs for commercial and residential use', 3),
('paving-stones', 'Paving & Natural Stones', 'Outdoor and landscaping stones', 4),
('cobbles', 'Cobbles', 'Heavy-duty stones for driveways and pathways', 5),
('artistic-handicrafts', 'Artistic Handicrafts', 'Custom-carved decorative works', 6),
('cemetery-works', 'Cemetery Works', 'Bespoke memorials and tombstones', 7)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Default Site Settings
INSERT INTO site_settings (setting_key, setting_value) VALUES 
('hero_image', 'https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png'),
('about_image', 'https://customer-assets.emergentagent.com/job_design-preview-123/artifacts/yfzi6ael_image.png'),
('logo_image', ''),
('site_name', 'Stonic Export'),
('contact_phone_1', '+91 9544982471'),
('contact_phone_2', '+91 7559912233'),
('contact_email', 'info@stonicexport.com'),
('whatsapp_number', '919544982471')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Sample Products
INSERT INTO products (id, name, category_id, description, origin, finish, thickness, image_url, featured) VALUES 
(UUID(), 'Makrana White Marble', 'indian-marbles', 'Classic Indian white marble from Makrana with elegant grey veining. Perfect for flooring and countertops.', 'Makrana, Rajasthan', 'Polished', '18-20mm', 'https://images.unsplash.com/photo-1694378061058-bb6532de3bba?w=800', TRUE),
(UUID(), 'Carrara White Marble', 'imported-marbles', 'Premium Italian Carrara marble known for its soft white background and delicate grey veining.', 'Italy', 'Polished', '18-20mm', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800', TRUE),
(UUID(), 'Black Galaxy Granite', 'granite', 'Stunning black granite with golden flecks resembling a starry night sky.', 'India', 'Polished', '20-30mm', 'https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/f11360bcab07e833ac42c1125d6072727a090078e13e0c7262e777b9a23c9a3c.png', TRUE),
(UUID(), 'Kota Stone', 'paving-stones', 'Durable natural paving stone ideal for outdoor landscaping and pathways.', 'Kota, Rajasthan', 'Natural', '25-50mm', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', FALSE),
(UUID(), 'Grey Cobblestones', 'cobbles', 'Premium grey cobblestones perfect for elegant driveways and courtyards.', 'India', 'Tumbled', '40-60mm', 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800', FALSE),
(UUID(), 'Marble Fountain Sculpture', 'artistic-handicrafts', 'Exquisitely hand-carved marble fountain for luxury gardens and courtyards.', 'India', 'Polished', 'Custom', 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=800', TRUE),
(UUID(), 'Premium Memorial Stone', 'cemetery-works', 'High-precision carved memorial with custom designs available.', 'India', 'Mirror Polish', 'Custom', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', FALSE);

-- =====================================================
-- HELPFUL QUERIES
-- =====================================================

-- Get all products with category name:
-- SELECT p.*, c.name as category_name FROM products p 
-- JOIN categories c ON p.category_id = c.id 
-- ORDER BY p.created_at DESC;

-- Get featured products:
-- SELECT * FROM products WHERE featured = TRUE;

-- Get products by category:
-- SELECT * FROM products WHERE category_id = 'indian-marbles';

-- Get product with gallery images:
-- SELECT p.*, GROUP_CONCAT(pg.image_url) as gallery_images 
-- FROM products p 
-- LEFT JOIN product_gallery pg ON p.id = pg.product_id 
-- WHERE p.id = 'your-product-id'
-- GROUP BY p.id;
