<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$orderId = isset($data['order_id']) ? (int)$data['order_id'] : 0;

if (!$orderId) {
    echo json_encode(['success' => false, 'message' => 'Missing order ID']);
    exit;
}

// Step 1: Fetch order info
$query = "SELECT Status, ProductID, OrderQuantity FROM purchasingorders WHERE OrderID = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $orderId);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Order not found']);
    exit;
}

$stmt->bind_result($status, $productId, $quantity);
$stmt->fetch();
$stmt->close();

// Step 2: If Approved, update inventory and insert stock return
if ($status === 'Approved') {
    // Find inventory record for this product
    $invCheck = $conn->prepare("SELECT InventoryID FROM inventory WHERE ProductID = ? LIMIT 1");
    $invCheck->bind_param("i", $productId);
    $invCheck->execute();
    $invCheck->store_result();

    if ($invCheck->num_rows > 0) {
        $invCheck->bind_result($inventoryId);
        $invCheck->fetch();
        $invCheck->close();

        // Subtract stock from inventory
        $invUpdate = $conn->prepare("UPDATE inventory SET QuantityAvailable = QuantityAvailable - ? WHERE InventoryID = ?");
        $invUpdate->bind_param("ii", $quantity, $inventoryId);
        $invUpdate->execute();
        $invUpdate->close();

        // Insert into stockreturns
        $reason = "Order deleted after approval";
        $insertReturn = $conn->prepare("INSERT INTO stockreturns (CustomerOrderID, ProductID, Quantity, ReasonForReturn, InventoryID) VALUES (?, ?, ?, ?, ?)");
        $insertReturn->bind_param("iiisi", $orderId, $productId, $quantity, $reason, $inventoryId);
        $insertReturn->execute();
        $insertReturn->close();
    } else {
        $invCheck->close();
        echo json_encode(['success' => false, 'message' => 'Inventory not found for this product']);
        exit;
    }
}

// Step 3: Delete purchasing order
$delete = $conn->prepare("DELETE FROM purchasingorders WHERE OrderID = ?");
$delete->bind_param("i", $orderId);

if ($delete->execute()) {
    echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete order']);
}
$delete->close();
