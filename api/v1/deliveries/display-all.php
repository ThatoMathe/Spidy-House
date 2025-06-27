<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

function getDeliveries() {
    global $conn;


    $sql = "
        SELECT
            d.DeliveryID,
            c.CustomerID,
            c.CustomerName,
            c.CustomerAddress,
            d.CustomerAddress AS DeliveryAddress,
            cr.CourierName,
            d.Status
        FROM
            customers c
        LEFT JOIN
            deliveries d ON c.DeliveryID = d.DeliveryID
        LEFT JOIN
            courier cr ON d.CourierID = cr.CourierID
        LEFT JOIN
            customerorders co ON c.CustomerID = co.CustomerID
        WHERE
            d.Status = 'Pending'
        GROUP BY
            c.CustomerID, c.CustomerName, c.CustomerAddress, d.DeliveryID, d.CustomerAddress, cr.CourierName, d.Status;
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $data = [];
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getDeliveries(), JSON_PRETTY_PRINT);
?>
