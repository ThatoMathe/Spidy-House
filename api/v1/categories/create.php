<?php
header('Content-Type: application/json');
require_once $_SERVER['DOCUMENT_ROOT'] . '/config/db.php';

allowOnlyAdmins('admin, manager');

$data = json_decode(file_get_contents("php://input"), true);
$categoryName = trim($data['CategoryName'] ?? '');

if (!$categoryName) {
    echo json_encode(['status' => 'error', 'message' => 'Category name is required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO categories (CategoryName) VALUES (?)");
$stmt->bind_param("s", $categoryName);

if ($stmt->execute()) {
    $category_id = $stmt->insert_id; // Get the new ID
    echo json_encode([
        'status' => 'success',
        'message' => 'Category added',
        'id' => $category_id // Send back the new ID
    ]);

    logUserActivity($conn, "Categories", "Added category [$categoryName]", $category_id);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Insert failed']);
}

$stmt->close();
$conn->close();
