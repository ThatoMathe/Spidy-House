<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin');

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);

$storeID = $data['StoreID'] ?? null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing StoreID']);
    exit;
}

$sql = "DELETE FROM stores WHERE StoreID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $storeID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Store deleted successfully']);
    logUserActivity($conn, "Stores", "Deleted store [$storeID]");
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete store']);
}
?>
