<?php
$docRoot = $_SERVER['DOCUMENT_ROOT']; // Document root of the web server
require_once $docRoot . '/config/db.php'; // Include your database connection

allowOnlyAdmins('super_admin, manager, staff');

function getSuppliers() {
    global $conn;

    $sql = "SELECT SupplierID, SupplierName, SupplierAddress, CreatedDate
     FROM suppliers"; // Query to get supplier info
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $suppliers = [];
        while($row = $result->fetch_assoc()) {
            $suppliers[] = $row;
        }
        return $suppliers;
    } else {
        return [];
    }
}

// Output the suppliers as a JSON response
header('Content-Type: application/json'); // Ensure the response is in JSON format
echo json_encode(getSuppliers(), JSON_PRETTY_PRINT); // Encode the result as JSON
?>
