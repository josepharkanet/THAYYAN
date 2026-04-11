<?php
$IMAGE_REQUIREMENTS = [
    "hero_image" => ["width" => 1920, "height" => 1080, "description" => "Homepage Hero Banner", "format" => "JPG/PNG/WebP"],
    "about_image" => ["width" => 800, "height" => 1000, "description" => "About Page - Proprietor Photo", "format" => "JPG/PNG"],
    "logo_image" => ["width" => 200, "height" => 60, "description" => "Site Logo (transparent PNG preferred)", "format" => "PNG/SVG"],
    "product_main" => ["width" => 800, "height" => 800, "description" => "Product Main Image (Square)", "format" => "JPG/PNG/WebP"],
    "product_gallery" => ["width" => 800, "height" => 800, "description" => "Product Gallery Images (Square)", "format" => "JPG/PNG/WebP"],
    "category_image" => ["width" => 600, "height" => 750, "description" => "Category Card Image (4:5 ratio)", "format" => "JPG/PNG/WebP"]
];

$DEFAULT_SETTINGS = [
    "hero_image" => "https://static.prod-images.emergentagent.com/jobs/d7be1953-c1b2-4391-b4cf-169457290853/images/3eda6b8e24809bd6028cb07fecfdd62dc519881e7e26072e0318301ceb793ef5.png",
    "about_image" => "https://customer-assets.emergentagent.com/job_design-preview-123/artifacts/yfzi6ael_image.png",
    "logo_image" => ""
];

function handleGetSettings() {
    global $IMAGE_REQUIREMENTS, $DEFAULT_SETTINGS;
    $db = getDB();
    $stmt = $db->query("SELECT setting_key, setting_value FROM site_settings");
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $r) {
        $settings[$r['setting_key']] = $r['setting_value'] ?? '';
    }
    echo json_encode([
        "hero_image" => $settings['hero_image'] ?? $DEFAULT_SETTINGS['hero_image'],
        "about_image" => $settings['about_image'] ?? $DEFAULT_SETTINGS['about_image'],
        "logo_image" => $settings['logo_image'] ?? $DEFAULT_SETTINGS['logo_image'],
        "image_requirements" => $IMAGE_REQUIREMENTS
    ]);
}

function handleUpdateSettings() {
    global $IMAGE_REQUIREMENTS;
    $user = requireAdmin();
    $body = getBody();
    $allowed = ['hero_image', 'about_image', 'logo_image'];
    $updates = array_intersect_key($body, array_flip($allowed));
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(["detail" => "No update data provided"]);
        return;
    }
    $db = getDB();
    foreach ($updates as $key => $value) {
        $stmt = $db->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?");
        $stmt->execute([$key, $value, $value]);
    }
    handleGetSettings();
}

function handleGetImageRequirements() {
    global $IMAGE_REQUIREMENTS;
    echo json_encode($IMAGE_REQUIREMENTS);
}
