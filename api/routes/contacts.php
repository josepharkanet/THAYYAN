<?php
function handleCreateContact() {
    $body = getBody();
    $name = $body['name'] ?? '';
    $email = $body['email'] ?? '';
    $message = $body['message'] ?? '';

    if (!$name || !$email || !$message) {
        http_response_code(422);
        echo json_encode(["detail" => "Name, email, and message are required"]);
        return;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(422);
        echo json_encode(["detail" => "Invalid email address"]);
        return;
    }

    $id = generateUUID();
    $now = date('Y-m-d H:i:s');
    $db = getDB();
    $stmt = $db->prepare("INSERT INTO contacts (id, name, email, phone, message, created_at) VALUES (?,?,?,?,?,?)");
    $stmt->execute([$id, $name, $email, $body['phone'] ?? null, $message, $now]);

    echo json_encode([
        "id" => $id,
        "name" => $name,
        "email" => $email,
        "phone" => $body['phone'] ?? null,
        "message" => $message,
        "created_at" => $now
    ]);
}

function handleGetContacts() {
    $user = requireAdmin();
    $db = getDB();
    $stmt = $db->query("SELECT id, name, email, phone, message, created_at FROM contacts ORDER BY created_at DESC");
    $rows = $stmt->fetchAll();
    $contacts = [];
    foreach ($rows as $r) {
        $contacts[] = [
            "id" => $r['id'],
            "name" => $r['name'],
            "email" => $r['email'],
            "phone" => $r['phone'],
            "message" => $r['message'],
            "created_at" => $r['created_at'] ?? ''
        ];
    }
    echo json_encode($contacts);
}
