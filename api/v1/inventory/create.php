<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php'; // Make sure this defines $conn

allowOnlyAdmins('admin, manager, staff');

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    !isset($data['SupplierID']) ||
    !isset($data['WarehouseID']) ||
    !isset($data['MinimumStockLevel']) ||
    !isset($data['MaximumStockLevel'])
) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Prepare values
$supplierID = $data['SupplierID'];
$warehouseID = $data['WarehouseID'];
$minStock = $data['MinimumStockLevel'];
$maxStock = $data['MaximumStockLevel'];

$sql = "INSERT INTO inventory (
            ProductID, SupplierID, QuantityAvailable, MinimumStockLevel, MaximumStockLevel, WarehouseID, LastOrderDate
        ) VALUES (
            NULL, ?, 0, ?, ?, ?, NULL
        )";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $supplierID, $minStock, $maxStock, $warehouseID);

if ($stmt->execute()) {
    $productID = $stmt->insert_id; // Get new ProductID

    echo json_encode([
        "success" => true,
        "id" => $productID
    ]);

    logUserActivity($conn, "Inventory", "Added inventory [$productID]", $productID);
} else {
    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
?>
