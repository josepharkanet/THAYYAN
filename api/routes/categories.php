<?php
function handleGetCategories() {
    $db = getDB();
    $stmt = $db->query("SELECT id, name, description FROM categories ORDER BY sort_order");
    echo json_encode($stmt->fetchAll());
}
