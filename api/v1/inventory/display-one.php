<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing inventory ID"]);
    exit();
}

$inventoryID = intval($_GET['id']);

try {
    // Step 1: Get inventory item
    $query = "SELECT * FROM inventory WHERE InventoryID = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
    $stmt->bind_param("i", $inventoryID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(["error" => "Inventory item not found"]);
        exit();
    }

    $inventoryItem = $result->fetch_assoc();
    $stmt->close();

    // Step 2: Check if product exists
    $productID = $inventoryItem['ProductID'];
    $checkProduct = $conn->prepare("SELECT 1 FROM products WHERE ProductID = ? LIMIT 1");
    $checkProduct->bind_param("i", $productID);
    $checkProduct->execute();
    $productExists = $checkProduct->get_result()->num_rows > 0;
    $checkProduct->close();

    // Add productAvailable key to the response
    $inventoryItem['productAvailable'] = $productExists;

    echo json_encode($inventoryItem);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error", "details" => $e->getMessage()]);
}
?>
