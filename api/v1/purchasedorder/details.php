<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

function getPurchasedOrders($orderId) {
    global $conn;

    $sql = "
        SELECT 
            po.OrderID,
            po.OrderDate,
            po.ExpectedDate,
            po.ActualDate,
            po.OrderQuantity as Quantity,
            p.ProductID,
            p.ProductCode,
            p.ProductName,
            po.Status,
            p.ProductDescription,
            p.ProductImage,
            p.BarCode,
            c.CategoryName,
            s.SupplierName,
            s.SupplierAddress
        FROM purchasingorders po
        JOIN products p ON po.ProductID = p.ProductID
        JOIN suppliers s ON po.SupplierID = s.SupplierID
        JOIN categories c ON p.CategoryID = c.CategoryID
        WHERE po.OrderID = ?
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
