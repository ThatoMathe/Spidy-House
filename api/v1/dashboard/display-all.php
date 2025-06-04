<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager,staff');

function getDashboardTotals() {
    global $conn;

    $totals = [];

    // Tables and their primary keys
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
        'stores' => 'StoreID'
    ];

    // Count each table
    foreach ($tables as $table => $primaryKey) {
        $sql = "SELECT COUNT(*) as total FROM `$table`";
        $result = $conn->query($sql);
        $totals[$table] = ($result && $row = $result->fetch_assoc()) ? (int)$row['total'] : 0;
    }

    // Stock Alert: QuantityAvailable <= MinimumStockLevel
    $sqlAlert = "SELECT COUNT(*) as total FROM inventory WHERE QuantityAvailable <= MinimumStockLevel";
    $resultAlert = $conn->query($sqlAlert);
    $totals['stock_alert'] = ($resultAlert && $row = $resultAlert->fetch_assoc()) ? (int)$row['total'] : 0;

    // Out of Stock: QuantityAvailable = 0
    $sqlOut = "SELECT COUNT(*) as total FROM inventory WHERE QuantityAvailable = 0";
    $resultOut = $conn->query($sqlOut);
    $totals['out_of_stock'] = ($resultOut && $row = $resultOut->fetch_assoc()) ? (int)$row['total'] : 0;

    $q2 = mysqli_query($conn, "SELECT SUM(QuantityAvailable) as total FROM inventory");
    $totals['stock'] = mysqli_fetch_assoc($q2)['total'] ?? 0;

    return $totals;
}

echo json_encode(getDashboardTotals(), JSON_PRETTY_PRINT);
?>
