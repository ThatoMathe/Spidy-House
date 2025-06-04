<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Missing supplier ID']);
    exit;
}

// Get order stats for this supplier
$orderStatsQuery = "
 SELECT 
    COUNT(DISTINCT po.OrderID) AS total,
    MAX(po.OrderDate) AS lastOrdered,
    SUM(po.OrderQuantity) AS totalItems,
    SUM(po.Status = 'Pending') AS pending,
    SUM(po.Status = 'Approved') AS approved
  FROM purchasingorders po
  JOIN products p ON po.ProductID = p.ProductID
  WHERE p.SupplierID = ?
";

$stmt1 = $conn->prepare($orderStatsQuery);
$stmt1->bind_param("i", $id);
$stmt1->execute();
$orderStatsResult = $stmt1->get_result()->fetch_assoc();
$stmt1->close();

// Add fallback if no results
if (!$orderStatsResult) {
    $orderStatsResult = [
        'total' => 0,
        'lastOrdered' => null,
        'totalItems' => 0,
    ];
}

// Get all products from this supplier
$productQuery = "SELECT ProductName, ProductCode FROM products WHERE SupplierID = ?";
$stmt2 = $conn->prepare($productQuery);
$stmt2->bind_param("i", $id);
$stmt2->execute();
$productResult = $stmt2->get_result();
$products = [];
while ($row = $productResult->fetch_assoc()) {
    $products[] = $row;
}
$stmt2->close();

echo json_encode([
    "orderStats" => $orderStatsResult,
    "linkedProducts" => $products
]);
