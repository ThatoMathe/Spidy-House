<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$data = json_decode(file_get_contents("php://input"), true);
$categoryID = intval($data['CategoryID'] ?? 0);
$categoryName = trim($data['CategoryName'] ?? '');

if (!$categoryID || !$categoryName) {
    echo json_encode(['status' => 'error', 'message' => 'Category ID and name are required']);
    exit;
}

$stmt = $conn->prepare("UPDATE categories SET CategoryName = ? WHERE CategoryID = ?");
$stmt->bind_param("si", $categoryName, $categoryID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Category updated']);
    logUserActivity($conn, "Categories", "Modified category [$categoryID]");
} else {
    echo json_encode(['status' => 'error', 'message' => 'Update failed']);
}

$stmt->close();
$conn->close();
