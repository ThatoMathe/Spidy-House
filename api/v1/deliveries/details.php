<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

$id = $_GET['DeliveryID'] ?? 1;

if (!$id) {
    echo json_encode(['error' => 'Missing Delivery ID']);
    exit;
}

$query = "
SELECT
    c.CustomerID,
    c.CustomerName,
    c.CustomerAddress,
    d.CustomerAddress AS DeliveryAddress,
    cr.CourierName,
    d.Status,
    p.ProductName,
    p.ProductCode,
    co.Quantity
FROM
    deliveries d
LEFT JOIN
     customers c ON c.DeliveryID = d.DeliveryID
LEFT JOIN
    courier cr ON d.CourierID = cr.CourierID
LEFT JOIN
    customerorders co ON c.CustomerID = co.CustomerID
LEFT JOIN
    products p ON co.ProductID = p.ProductID
WHERE
    d.Status = 'Pending' AND d.DeliveryID = ?
";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

$products = [];
$info = null;

while ($row = $result->fetch_assoc()) {
    if (!$info) {
        $info = [
            "CustomerID" => $row["CustomerID"],
            "CustomerName" => $row["CustomerName"],
            "CustomerAddress" => $row["CustomerAddress"],
            "DeliveryAddress" => $row["DeliveryAddress"],
            "CourierName" => $row["CourierName"],
            "Status" => $row["Status"]
        ];
    }
    $products[] = [
        "ProductName" => $row["ProductName"],
        "ProductCode" => $row["ProductCode"],
        "Quantity" => $row["Quantity"]
    ];
}

echo json_encode([
    "info" => $info,
    "linkedProducts" => $products
]);
