<?php
function handleLogin() {
    $body = getBody();
    $email = strtolower($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(422);
        echo json_encode(["detail" => "Email and password required"]);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(["detail" => "Invalid credentials"]);
        return;
    }

    $accessToken = createToken($user['id'], $email, 'access');
    $refreshToken = createToken($user['id'], $email, 'refresh');

    setcookie('access_token', $accessToken, [
        'expires' => time() + 3600,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    setcookie('refresh_token', $refreshToken, [
        'expires' => time() + 604800,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    echo json_encode([
        "id" => (string)$user['id'],
        "email" => $user['email'],
        "name" => $user['name'] ?? '',
        "role" => $user['role'] ?? 'user',
        "access_token" => $accessToken
    ]);
}

function handleLogout() {
    setcookie('access_token', '', ['expires' => time() - 3600, 'path' => '/']);
    setcookie('refresh_token', '', ['expires' => time() - 3600, 'path' => '/']);
    echo json_encode(["message" => "Logged out successfully"]);
}

function handleMe() {
    $user = getCurrentUser();
    echo json_encode([
        "id" => (string)$user['id'],
        "email" => $user['email'],
        "name" => $user['name'] ?? '',
        "role" => $user['role'] ?? 'user'
    ]);
}
