<?php
// Include DB
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

function getPurchasingOrders() {
    global $conn;

    $orders = [];

    $sql = "
        SELECT 
            po.OrderID,
            po.OrderDate,
            po.ExpectedDate,
            po.ActualDate,
            s.SupplierName,
            s.SupplierAddress,
            p.ProductID,
            p.ProductCode,
            p.ProductName,
            p.ProductDescription,
            p.ProductImage,
            p.BarCode,
            p.CategoryID,
            c.CategoryName,
            po.OrderQuantity
        FROM purchasingorders po
        JOIN products p ON p.ProductID = po.ProductID
        JOIN suppliers s ON po.SupplierID = s.SupplierID
        JOIN categories c ON p.CategoryID = c.CategoryID
        ORDER BY po.OrderID DESC
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orderID = $row['OrderID'];

            if (!isset($orders[$orderID])) {
                $orders[$orderID] = [
                    'OrderID' => $orderID,
                    'OrderDate' => $row['OrderDate'],
                    'ExpectedDate' => $row['ExpectedDate'],
                    'ActualDate' => $row['ActualDate'],
                    'SupplierName' => $row['SupplierName'],
                    'SupplierAddress' => $row['SupplierAddress'],
                    'TotalQuantity' => 0,
                    'Products' => [],
                ];
            }

            $orders[$orderID]['TotalQuantity'] += (int)$row['OrderQuantity'];
            $orders[$orderID]['Products'][] = [
                'ProductID' => $row['ProductID'],
                'ProductCode' => $row['ProductCode'],
                'ProductName' => $row['ProductName'],
                'ProductDescription' => $row['ProductDescription'],
                'ProductImage' => $row['ProductImage'],
                'BarCode' => $row['BarCode'],
                'CategoryID' => $row['CategoryID'],
                'CategoryName' => $row['CategoryName'],
                'Quantity' => (int)$row['OrderQuantity']
            ];
        }
        return array_values($orders); // reset keys
    } else {
        return [];
    }
}

echo json_encode(getPurchasingOrders(), JSON_PRETTY_PRINT);
?>
