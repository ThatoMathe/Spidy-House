<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

function getCustomers() {
    global $conn;
    
    $sql = "
        SELECT 
            *
        FROM customers 
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $customers = [];
        while($row = $result->fetch_assoc()) {
            $customers[] = $row;
        }
        return $customers[] = $row;
;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getCustomers(), JSON_PRETTY_PRINT);
?>
