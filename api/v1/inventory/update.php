<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

header('Content-Type: application/json');

allowOnlyAdmins('admin, manager, staff');

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['InventoryID'])) {
    echo json_encode(["success" => false, "message" => "InventoryID is required."]);
    exit;
}

$inventoryID = intval($data['InventoryID']);
$supplierID = intval($data['SupplierID'] ?? 0);
$minStock = intval($data['MinimumStockLevel'] ?? 0);
$maxStock = intval($data['MaximumStockLevel'] ?? 0);
$warehouseID = intval($data['WarehouseID'] ?? 0);
$sql = "UPDATE inventory SET
    SupplierID = ?,
    MinimumStockLevel = ?,
    MaximumStockLevel = ?,
    WarehouseID = ?
    WHERE InventoryID = ?";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("iiiii", $supplierID, $minStock, $maxStock, $warehouseID, $inventoryID);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
    logUserActivity($conn, "Inventory", "Modified inventory [$inventoryID]", $inventoryID);
} else {
    echo json_encode(["success" => false, "message" => $stmt->error]);
}

$stmt->close();
exit;
