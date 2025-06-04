<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

function getCouriers() {
    global $conn;

    $sql = "
        SELECT 
            CourierID,
            CourierName,
            Address,
            ContactNumber
        FROM courier
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $couriers = [];
        while($row = $result->fetch_assoc()) {
            $couriers[] = $row;
        }
        return $couriers;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getCouriers(), JSON_PRETTY_PRINT);
?>
