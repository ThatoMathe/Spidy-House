<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

function getInventory() {
    global $conn;

    $sql = "
        SELECT 
            i.InventoryID,
            p.ProductName,
            p.BarCode,
            i.QuantityAvailable,
            i.MinimumStockLevel,
            i.MaximumStockLevel,
            i.SupplierID,
            s.SupplierName,
            w.WarehouseName,
            w.WarehouseID,
            i.LastOrderDate
        FROM inventory i
        LEFT JOIN products p ON i.ProductID = p.ProductID
        LEFT JOIN suppliers s ON i.SupplierID = s.SupplierID
        LEFT JOIN warehouse w ON i.WarehouseID = w.WarehouseID
        ORDER BY i.InventoryID DESC
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $inventory = [];
        while($row = $result->fetch_assoc()) {
            $inventory[] = $row;
        }
        return $inventory;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getInventory(), JSON_PRETTY_PRINT);
?>
