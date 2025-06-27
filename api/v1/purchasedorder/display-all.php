<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

function getPurchasedOrders($conn)
{
    $sql = "
        SELECT
            po.OrderID,
            p.ProductName,
            po.OrderDate,
            po.ExpectedDate,
            po.OrderQuantity,
            s.SupplierName,
            po.ActualDate,
            po.Status
        FROM purchasingorders po
        JOIN products p ON po.ProductID = p.ProductID
        LEFT JOIN suppliers s ON po.SupplierID = s.SupplierID
        ORDER BY po.OrderDate DESC
    ";

    $result = $conn->query($sql);

    $orders = [];

    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $orders[] = [
                'order_id'      => $row['OrderID'],
                'product_name'  => $row['ProductName'],
                'order_date'    => $row['OrderDate'],
                'status'        => $row['Status'],
                'expected_date' => $row['ExpectedDate'],
                'quantity'      => $row['OrderQuantity'],
                'supplier'      => $row['SupplierName'],
            ];
        }
    }

    return ['success' => true, 'data' => $orders];
}

// Output the response
echo json_encode(getPurchasedOrders($conn), JSON_PRETTY_PRINT);
