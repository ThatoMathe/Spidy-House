<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin');

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Extract fields
$storeName = $data['StoreName'] ?? '';
$storeLocation = $data['StoreLocation'] ?? '';

// Validate
if (empty($storeName) || empty($storeLocation)) {
    echo json_encode(['success' => false, 'message' => 'Store name and location are required.']);
    exit;
}

// Insert into stores table
$sql = "INSERT INTO stores (StoreName, StoreLocation) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $storeName, $storeLocation);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Store added successfully.']);
    logUserActivity($conn, "Stores", "Added store [$storeName]");
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to add store.']);
}
?>
