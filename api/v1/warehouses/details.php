<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin');

$id = $_GET['WarehouseID'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Missing Warehouse ID']);
    exit;
}

$userQuery = "
SELECT 
    w.WarehouseID,
    w.WarehouseName,
    w.LocationName,
    w.LocationAddress,
    COALESCE(COUNT(DISTINCT u.UserID), 0) AS TotalUsers,
    COALESCE(COUNT(DISTINCT i.SupplierID), 0) AS TotalSuppliers,
    COALESCE(SUM(i.QuantityAvailable), 0) AS TotalAvailableStock,
    COALESCE(SUM(i.MinimumStockLevel), 0) AS TotalMinimumStock,
    COALESCE(SUM(i.MaximumStockLevel), 0) AS TotalMaximumStock,
    MAX(i.LastOrderDate) AS LastOrderDate
FROM 
    warehouse w
LEFT JOIN
    users u ON u.WarehouseID = w.WarehouseID
LEFT JOIN 
    inventory i ON i.WarehouseID = w.WarehouseID
WHERE 
    w.WarehouseID = ?
GROUP BY 
    w.WarehouseID, w.WarehouseName, w.LocationName, w.LocationAddress
";

$stmt = $conn->prepare($userQuery);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();
$stmt->close();

echo json_encode($data ?: []);
