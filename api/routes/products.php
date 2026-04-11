<?php
function handleGetProducts() {
    $db = getDB();
    $query = "SELECT * FROM products WHERE 1=1";
    $params = [];

    if (isset($_GET['category']) && $_GET['category']) {
        $query .= " AND category_id = ?";
        $params[] = $_GET['category'];
    }
    if (isset($_GET['featured'])) {
        $query .= " AND featured = ?";
        $params[] = $_GET['featured'] === 'true' ? 1 : 0;
    }
    $query .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $products = [];
    foreach ($rows as $row) {
        $products[] = formatProduct($row, $db);
    }
    echo json_encode($products);
}

function handleGetProduct($id) {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        http_response_code(404);
        echo json_encode(["detail" => "Product not found"]);
        return;
    }
    echo json_encode(formatProduct($row, $db));
}

function handleCreateProduct() {
    $user = requireAdmin();
    $body = getBody();
    $id = generateUUID();
    $now = date('Y-m-d H:i:s');

    $db = getDB();
    $stmt = $db->prepare("INSERT INTO products (id, name, category_id, description, origin, finish, thickness, image_url, featured, created_at) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->execute([
        $id,
        $body['name'] ?? '',
        $body['category'] ?? '',
        $body['description'] ?? '',
        $body['origin'] ?? null,
        $body['finish'] ?? null,
        $body['thickness'] ?? null,
        $body['image_url'] ?? '',
        !empty($body['featured']) ? 1 : 0,
        $now
    ]);

    foreach (($body['applications'] ?? []) as $app) {
        $stmt = $db->prepare("INSERT INTO product_applications (product_id, application) VALUES (?, ?)");
        $stmt->execute([$id, $app]);
    }
    foreach (($body['gallery_images'] ?? []) as $img) {
        $stmt = $db->prepare("INSERT INTO product_gallery (product_id, image_url) VALUES (?, ?)");
        $stmt->execute([$id, $img]);
    }

    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(formatProduct($stmt->fetch(), $db));
}

function handleUpdateProduct($id) {
    $user = requireAdmin();
    $body = getBody();
    $db = getDB();

    $stmt = $db->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$id]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(["detail" => "Product not found"]);
        return;
    }

    $fields = [];
    $values = [];
    $map = [
        'name' => 'name', 'category' => 'category_id', 'description' => 'description',
        'origin' => 'origin', 'finish' => 'finish', 'thickness' => 'thickness',
        'image_url' => 'image_url'
    ];
    foreach ($map as $bodyKey => $dbCol) {
        if (isset($body[$bodyKey])) {
            $fields[] = "$dbCol = ?";
            $values[] = $body[$bodyKey];
        }
    }
    if (isset($body['featured'])) {
        $fields[] = "featured = ?";
        $values[] = $body['featured'] ? 1 : 0;
    }
    if ($fields) {
        $values[] = $id;
        $db->prepare("UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?")->execute($values);
    }

    if (isset($body['applications'])) {
        $db->prepare("DELETE FROM product_applications WHERE product_id = ?")->execute([$id]);
        foreach ($body['applications'] as $app) {
            $db->prepare("INSERT INTO product_applications (product_id, application) VALUES (?, ?)")->execute([$id, $app]);
        }
    }
    if (isset($body['gallery_images'])) {
        $db->prepare("DELETE FROM product_gallery WHERE product_id = ?")->execute([$id]);
        foreach ($body['gallery_images'] as $img) {
            $db->prepare("INSERT INTO product_gallery (product_id, image_url) VALUES (?, ?)")->execute([$id, $img]);
        }
    }

    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(formatProduct($stmt->fetch(), $db));
}

function handleDeleteProduct($id) {
    $user = requireAdmin();
    $db = getDB();
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["detail" => "Product not found"]);
        return;
    }
    echo json_encode(["message" => "Product deleted successfully"]);
}
