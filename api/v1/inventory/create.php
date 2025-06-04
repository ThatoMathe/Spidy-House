<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php'; // Make sure this defines $conn

allowOnlyAdmins('super_admin, manager, staff');

$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Check for required fields
if (
    !isset($data['SupplierID']) ||
    !isset($data['WarehouseID']) ||
    !isset($data['QuantityAvailable']) ||
    !isset($data['MinimumStockLevel']) ||
    !isset($data['MaximumStockLevel'])
) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Prepare values
$supplierID = $conn->real_escape_string($data['SupplierID']);
$quantity   = $conn->real_escape_string($data['QuantityAvailable']);
$minStock   = $conn->real_escape_string($data['MinimumStockLevel']);
$maxStock   = $conn->real_escape_string($data['MaximumStockLevel']);
$warehouse  = $conn->real_escape_string($data['WarehouseID']);

// Simple SQL query
$sql = "INSERT INTO inventory (
            ProductID, SupplierID, QuantityAvailable, MinimumStockLevel, MaximumStockLevel, WarehouseID, LastOrderDate
        ) VALUES (
            NULL, '$supplierID', '$quantity', '$minStock', '$maxStock', '$warehouse', NULL
        )";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
    logUserActivity($conn, "Inventory", "Added inventory");
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}
?>
