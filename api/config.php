<?php
// Database configuration - UPDATE THESE WITH YOUR HOST ARMADA CREDENTIALS
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_database_name');    // From cPanel MySQL Databases
define('DB_USER', 'your_database_user');    // From cPanel MySQL Databases
define('DB_PASS', 'your_database_password'); // From cPanel MySQL Databases

// JWT Secret - change this to any random string
define('JWT_SECRET', 'change_this_to_a_random_string_at_least_32_chars');

// CORS - your domain
define('FRONTEND_URL', 'https://yourdomain.com');

// Get database connection
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["detail" => "Database connection failed"]);
        exit;
    }
}

// CORS Headers
function setCorsHeaders() {
    header("Access-Control-Allow-Origin: " . FRONTEND_URL);
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
}

// Handle preflight
function handlePreflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        setCorsHeaders();
        http_response_code(200);
        exit;
    }
}

// JWT functions
function createToken($userId, $email, $type = 'access') {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $exp = $type === 'access' ? time() + 3600 : time() + 604800;
    $payload = base64url_encode(json_encode([
        'sub' => (string)$userId,
        'email' => $email,
        'exp' => $exp,
        'type' => $type
    ]));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    $signature = base64url_encode(hash_hmac('sha256', "$parts[0].$parts[1]", JWT_SECRET, true));
    if (!hash_equals($signature, $parts[2])) return null;
    $payload = json_decode(base64url_decode($parts[1]), true);
    if (!$payload || $payload['exp'] < time()) return null;
    return $payload;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/'));
}

// Get current user from token
function getCurrentUser() {
    $token = null;
    if (isset($_COOKIE['access_token'])) {
        $token = $_COOKIE['access_token'];
    }
    $authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
    }
    if (!$token) {
        http_response_code(401);
        echo json_encode(["detail" => "Not authenticated"]);
        exit;
    }
    $payload = verifyToken($token);
    if (!$payload || $payload['type'] !== 'access') {
        http_response_code(401);
        echo json_encode(["detail" => "Invalid or expired token"]);
        exit;
    }
    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, name, role FROM users WHERE id = ?");
    $stmt->execute([$payload['sub']]);
    $user = $stmt->fetch();
    if (!$user) {
        http_response_code(401);
        echo json_encode(["detail" => "User not found"]);
        exit;
    }
    return $user;
}

// Require admin
function requireAdmin() {
    $user = getCurrentUser();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(["detail" => "Admin access required"]);
        exit;
    }
    return $user;
}

// Get JSON body
function getBody() {
    return json_decode(file_get_contents('php://input'), true) ?: [];
}

// Generate UUID
function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

// Format product row with applications and gallery
function formatProduct($row, $db) {
    $stmt = $db->prepare("SELECT application FROM product_applications WHERE product_id = ?");
    $stmt->execute([$row['id']]);
    $apps = array_column($stmt->fetchAll(), 'application');

    $stmt = $db->prepare("SELECT image_url FROM product_gallery WHERE product_id = ? ORDER BY sort_order");
    $stmt->execute([$row['id']]);
    $gallery = array_column($stmt->fetchAll(), 'image_url');

    return [
        'id' => $row['id'],
        'name' => $row['name'],
        'category' => $row['category_id'],
        'description' => $row['description'] ?? '',
        'origin' => $row['origin'],
        'finish' => $row['finish'],
        'thickness' => $row['thickness'],
        'applications' => $apps,
        'image_url' => $row['image_url'],
        'gallery_images' => $gallery,
        'featured' => (bool)$row['featured'],
        'created_at' => $row['created_at'] ?? ''
    ];
}
