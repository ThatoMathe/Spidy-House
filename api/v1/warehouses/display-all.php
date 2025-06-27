<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

function getWarehouse() {
    global $conn;

    $sql = "
        SELECT 
          WarehouseID,
          WarehouseName,
          LocationName,
          LocationAddress 
        FROM warehouse
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $warehouse = [];
        while($row = $result->fetch_assoc()) {
            $warehouse[] = $row;
        }
        return $warehouse;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getWarehouse(), JSON_PRETTY_PRINT);
?>
