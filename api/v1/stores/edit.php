<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get raw JSON input
$data = json_decode(file_get_contents('php://input'), true);

$storeID = $data['StoreID'] ?? null;
$storeName = $data['StoreName'] ?? '';
$storeLocation = $data['StoreLocation'] ?? '';
$managerID = $data['ManagerID'] ?? null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing StoreID']);
    exit;
}

$sql = "
    UPDATE stores
    SET 
        StoreName = ?,
        StoreLocation = ?,
        ManagerID = ?
    WHERE StoreID = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssii", $storeName, $storeLocation, $managerID, $storeID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Store updated successfully']);
    logUserActivity($conn, "Stores", "Modified store [$storeID]", $storeID);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
}
?>
