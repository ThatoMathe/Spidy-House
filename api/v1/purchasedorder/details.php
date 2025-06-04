<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

function getPurchasedOrders($orderId) {
    global $conn;

    $sql = "
        SELECT 
            po.OrderID,
            po.OrderDate,
            po.ExpectedDate,
            po.ActualDate,
            SUM(po.OrderQuantity) as TotalQuantity,
            p.BarCode,
            c.CategoryName,
            MIN(p.ProductID) as ProductID,
            MIN(p.ProductCode) as ProductCode,
            MIN(p.ProductName) as ProductName,
            MIN(p.ProductDescription) as ProductDescription,
            MIN(p.ProductImage) as ProductImage,
            MIN(p.CategoryID) as CategoryID,
            MIN(s.SupplierName) as SupplierName,
            MIN(s.SupplierAddress) as SupplierAddress
        FROM purchasingorders po
        JOIN products p ON po.OrderID = p.OrderID
        JOIN suppliers s ON po.SupplierID = s.SupplierID
        JOIN categories c ON p.CategoryID = c.CategoryID
        WHERE po.ProductID = ?
        GROUP BY p.BarCode, c.CategoryName
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $orderId);
    $stmt->execute();
    $result = $stmt->get_result();

    $PurchasedOrders = [];
    while ($row = $result->fetch_assoc()) {
        $PurchasedOrders[] = $row;
    }

    return $PurchasedOrders;
}

header('Content-Type: application/json');

$orderId = isset($_GET['orderId']) ? (int)$_GET['orderId'] : 0;
echo json_encode(getPurchasedOrders($orderId), JSON_PRETTY_PRINT);
?>
