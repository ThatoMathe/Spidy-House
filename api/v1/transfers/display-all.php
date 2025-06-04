<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

function getTransfers() {
    global $conn;
    
$sql = "
SELECT
    t.TransferID,
    p.ProductName,
    w.WarehouseName,
    s.StoreName,
    t.TransferQuantity,
    t.SentDate,
    t.ReceivedDate
FROM transfers t
JOIN products p ON t.ProductID = p.ProductID
LEFT JOIN warehouse w ON t.FromWarehouseID = w.WarehouseID
LEFT JOIN stores s ON t.StoreID = s.StoreID
ORDER BY t.SentDate DESC;
";





    $result = $conn->query($sql);

    $transfers = [];

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $transfers[] = $row;
        }
    }

    return $transfers;
}

header('Content-Type: application/json');
echo json_encode(getTransfers(), JSON_PRETTY_PRINT);
?>
