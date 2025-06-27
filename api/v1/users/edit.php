<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required data is provided
if (isset($data['UserID'], $data['UserName'], $data['Email'], $data['Role'], $data['WarehouseID'])) {
    $userID = $data['UserID'];
    $userName = $data['UserName'];
    $email = $data['Email'];
    $role = $data['Role'];
    $warehouseID = $data['WarehouseID'];
    
    // SQL query to update user details
    $query = "UPDATE users SET UserName = ?, Email = ?, Role = ?, WarehouseID = ? WHERE UserID = ?";

    // Prepare statement
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ssssi", $userName, $email, $role, $warehouseID, $userID);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "User updated successfully."]);
            logUserActivity($conn, "Users", "Modified user [$userID]", $userID);
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
