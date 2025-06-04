<?php
header('Content-Type: application/json');
require_once $_SERVER['DOCUMENT_ROOT'] . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$data = json_decode(file_get_contents("php://input"), true);
$categoryName = trim($data['CategoryName'] ?? '');

if (!$categoryName) {
    echo json_encode(['status' => 'error', 'message' => 'Category name is required']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO categories (CategoryName) VALUES (?)");
$stmt->bind_param("s", $categoryName);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Category added']);
    logUserActivity($conn, "Categories", "Added category [$categoryName]");
} else {
    echo json_encode(['status' => 'error', 'message' => 'Insert failed']);
}

$stmt->close();
$conn->close();
