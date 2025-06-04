<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required data is provided
if (isset($data['UserName'], $data['Email'], $data['Role'], $data['WarehouseID'])) {
    $userName = $data['UserName'];
    $email = $data['Email'];
    $role = $data['Role'];
    $warehouseID = $data['WarehouseID'];

    // Optionally, you can add more fields to update here.

    // SQL query to update user details
    $query = "INSERT users SET UserName = ?, Email = ?, Role = ?, WarehouseID = ?";

    // Prepare statement
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sssi", $userName, $email, $role, $warehouseID);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User updated successfully."]);
            logUserActivity($conn, "Users", "Added user [$userName] on warehouse [$warehouseID]");
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
