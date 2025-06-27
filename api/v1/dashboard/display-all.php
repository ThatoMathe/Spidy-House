<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager,staff');

$userRole    = $_SESSION['user']['Role'] ?? null;
$warehouseId = $_SESSION['user']['WarehouseID'] ?? null;

function getDashboardTotals($userRole, $warehouseId) {
    global $conn;
    $totals = [];

    $tables = [
        'users' => 'UserID',
        'products' => 'ProductID',
        'categories' => 'CategoryID',
        'purchasingorders' => 'OrderID',
        'deliveries' => 'DeliveryID',
        'transfers' => 'TransferID',
        'suppliers' => 'SupplierID',
        'customers' => 'CustomerID',
        'stockreturns' => 'StockReturnID',
        'customerorders' => 'CustomerOrderID',
        'courier' => 'CourierID',
        'warehouse' => 'WarehouseID',
        'stores' => 'StoreID',
        'useractivity' => 'ReportID',
    ];

    // Only these tables have a WarehouseID column
    $tables_with_warehouse_column = ['inventory', 'users', 'transfers', 'warehouse'];

    foreach ($tables as $table => $primaryKey) {
        $query = "SELECT COUNT(*) AS total FROM `$table`";

        if ($userRole !== 'admin' && in_array($table, $tables_with_warehouse_column)) {
            $query .= " WHERE WarehouseID = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $warehouseId);
        } else {
            $stmt = $conn->prepare($query);
        }

        if ($stmt && $stmt->execute()) {
            $result = $stmt->get_result();
            $totals[$table] = ($row = $result->fetch_assoc()) ? (int)$row['total'] : 0;
            $stmt->close();
        } else {
            $totals[$table] = 0;
        }
    }

    // Inventory-specific stats
    if ($userRole === 'admin') {
        $alert = $conn->query("SELECT COUNT(*) AS total FROM inventory WHERE QuantityAvailable <= MinimumStockLevel");
        $out = $conn->query("SELECT COUNT(*) AS total FROM inventory WHERE QuantityAvailable = 0");
        $stock = $conn->query("SELECT SUM(QuantityAvailable) AS total FROM inventory");
    } else {
        $alertStmt = $conn->prepare("SELECT COUNT(*) AS total FROM inventory WHERE QuantityAvailable <= MinimumStockLevel AND WarehouseID = ?");
        $alertStmt->bind_param("i", $warehouseId);
        $alertStmt->execute();
        $alert = $alertStmt->get_result();

        $outStmt = $conn->prepare("SELECT COUNT(*) AS total FROM inventory WHERE QuantityAvailable = 0 AND WarehouseID = ?");
        $outStmt->bind_param("i", $warehouseId);
        $outStmt->execute();
        $out = $outStmt->get_result();

        $stockStmt = $conn->prepare("SELECT SUM(QuantityAvailable) AS total FROM inventory WHERE WarehouseID = ?");
        $stockStmt->bind_param("i", $warehouseId);
        $stockStmt->execute();
        $stock = $stockStmt->get_result();
    }

    $totals['stock_alert'] = ($alert && $row = $alert->fetch_assoc()) ? (int)$row['total'] : 0;
    $totals['out_of_stock'] = ($out && $row = $out->fetch_assoc()) ? (int)$row['total'] : 0;
    $totals['stock'] = ($stock && $row = $stock->fetch_assoc()) ? (int)$row['total'] : 0;

    // Add warehouse name
    if ($userRole === 'admin') {
        $totals['warehouse_name'] = 'All Warehouses';
    } else {
        $stmt = $conn->prepare("SELECT WarehouseName FROM warehouse WHERE WarehouseID = ?");
        $stmt->bind_param("i", $warehouseId);
        $stmt->execute();
        $result = $stmt->get_result();
        $totals['warehouse_name'] = ($row = $result->fetch_assoc()) ? $row['WarehouseName'] : 'Unknown';
        $stmt->close();
    }

    return $totals;
}


// Output JSON
header('Content-Type: application/json');
echo json_encode(getDashboardTotals($userRole, $warehouseId), JSON_PRETTY_PRINT);
