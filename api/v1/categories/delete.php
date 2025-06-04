<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$data = json_decode(file_get_contents("php://input"), true);
$categoryID = intval($data['CategoryID'] ?? 0);

if (!$categoryID) {
    echo json_encode(['status' => 'error', 'message' => 'Category ID is required']);
    exit;
}

$stmt = $conn->prepare("DELETE FROM categories WHERE CategoryID = ?");
$stmt->bind_param("i", $categoryID);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Category deleted']);
    logUserActivity($conn, "Categories", "Deleted category [$categoryID]");
} else {
    echo json_encode(['status' => 'error', 'message' => 'Delete failed']);
}

$stmt->close();
$conn->close();
