<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$order_id    = isset($data['order_id']) ? (int)$data['order_id'] : 0;
$status      = isset($data['status']) ? $data['status'] : '';
$actual_date = isset($data['actual_date']) ? $data['actual_date'] : null;

if (!$order_id || !in_array($status, ['Pending', 'Approved', 'Rejected'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Step 1: Update purchasing order
$sql = "UPDATE purchasingorders SET Status = ?, ActualDate = ? WHERE OrderID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $status, $actual_date, $order_id);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to update order']);
    exit;
}
$stmt->close();

// Step 2: If approved, update inventory
if ($status === 'Approved') {
    // Get product & quantity from the order
    $query = "SELECT ProductID, OrderQuantity FROM purchasingorders WHERE OrderID = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $order_id);
    $stmt->execute();
    $stmt->bind_result($productId, $quantity);
    $stmt->fetch();
    $stmt->close();

    if (!$productId || !$quantity) {
        echo json_encode(['success' => false, 'message' => 'Order data missing']);
        exit;
    }

    // Get inventory record
    $inv = $conn->prepare("SELECT InventoryID, WarehouseID FROM inventory WHERE ProductID = ? LIMIT 1");
    $inv->bind_param("i", $productId);
    $inv->execute();
    $inv->store_result();

    if ($inv->num_rows === 0) {
        $inv->close();
        echo json_encode(['success' => false, 'message' => 'No matching inventory record found']);
        exit;
    }

    $inv->bind_result($inventoryId, $warehouseId);
    $inv->fetch();
    $inv->close();

    // Update inventory stock
    $update = $conn->prepare("UPDATE inventory SET QuantityAvailable = QuantityAvailable + ?, LastOrderDate = NOW() WHERE InventoryID = ?");
    $update->bind_param("ii", $quantity, $inventoryId);
    if ($update->execute()) {
        $update->close();

        // Optional: log the activity
        logUserActivity($conn, "Orders", "Order #$order_id approved and stock updated in inventory #$inventoryId", $inventoryId);

        echo json_encode(['success' => true, 'message' => 'Order updated and inventory stock adjusted']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Inventory update failed']);
    }
} else {
    echo json_encode(['success' => true, 'message' => 'Order updated successfully']);
}
