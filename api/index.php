<?php
require_once __DIR__ . '/config.php';
handlePreflight();
setCorsHeaders();

// Parse the request
$requestUri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// Remove query string and /api/ prefix
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('#^/api#', '', $path);
$path = rtrim($path, '/');
if ($path === '') $path = '/';

// Route the request
switch (true) {
    // Health check
    case $path === '/' && $method === 'GET':
        echo json_encode(["message" => "Stonic Export API", "status" => "running"]);
        break;

    // Auth
    case $path === '/auth/login' && $method === 'POST':
        require __DIR__ . '/routes/auth.php';
        handleLogin();
        break;
    case $path === '/auth/logout' && $method === 'POST':
        require __DIR__ . '/routes/auth.php';
        handleLogout();
        break;
    case $path === '/auth/me' && $method === 'GET':
        require __DIR__ . '/routes/auth.php';
        handleMe();
        break;

    // Products
    case $path === '/products' && $method === 'GET':
        require __DIR__ . '/routes/products.php';
        handleGetProducts();
        break;
    case preg_match('#^/products/([a-f0-9-]+)$#', $path, $m) && $method === 'GET':
        require __DIR__ . '/routes/products.php';
        handleGetProduct($m[1]);
        break;
    case $path === '/products' && $method === 'POST':
        require __DIR__ . '/routes/products.php';
        handleCreateProduct();
        break;
    case preg_match('#^/products/([a-f0-9-]+)$#', $path, $m) && $method === 'PUT':
        require __DIR__ . '/routes/products.php';
        handleUpdateProduct($m[1]);
        break;
    case preg_match('#^/products/([a-f0-9-]+)$#', $path, $m) && $method === 'DELETE':
        require __DIR__ . '/routes/products.php';
        handleDeleteProduct($m[1]);
        break;

    // Categories
    case $path === '/categories' && $method === 'GET':
        require __DIR__ . '/routes/categories.php';
        handleGetCategories();
        break;

    // Contacts
    case $path === '/contact' && $method === 'POST':
        require __DIR__ . '/routes/contacts.php';
        handleCreateContact();
        break;
    case $path === '/contacts' && $method === 'GET':
        require __DIR__ . '/routes/contacts.php';
        handleGetContacts();
        break;

    // Settings
    case $path === '/settings' && $method === 'GET':
        require __DIR__ . '/routes/settings.php';
        handleGetSettings();
        break;
    case $path === '/settings' && $method === 'PUT':
        require __DIR__ . '/routes/settings.php';
        handleUpdateSettings();
        break;
    case $path === '/settings/image-requirements' && $method === 'GET':
        require __DIR__ . '/routes/settings.php';
        handleGetImageRequirements();
        break;

    // 404
    default:
        http_response_code(404);
        echo json_encode(["detail" => "Not found"]);
}
