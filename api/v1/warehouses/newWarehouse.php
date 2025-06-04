<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required data is provided
if (isset($data['WarehouseName'], $data['LocationName'], $data['LocationAddress'])) {
    $WarehouseName = $data['WarehouseName'];
    $LocationName = $data['LocationName'];
    $LocationAddress = $data['LocationAddress'];

    // SQL query to update user details
    $query = "INSERT warehouse SET WarehouseName = ?, LocationName = ?, LocationAddress = ?";

    // Prepare statement
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sss", $WarehouseName, $LocationName, $LocationAddress);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Warehouse updated successfully."]);
            logUserActivity($conn, "Warehouse", "Added new warehouse");

        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update user."]);
        }
        
        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Database query failed."]);
    }

    $conn->close();

    
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
