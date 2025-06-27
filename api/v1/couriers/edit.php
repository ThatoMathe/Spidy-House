<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required data is provided
if (isset($data['CourierID'], $data['CourierName'], $data['Address'], $data['ContactNumber'])) {

    $CourierID = $data['CourierID'];
    $CourierName = $data['CourierName'];
    $Address = $data['Address'];
    $ContactNumber = $data['ContactNumber'];
    
    // SQL query to update user details
    $query = "UPDATE courier SET CourierName = ?, Address = ?, ContactNumber = ? WHERE CourierID = ?";

    // Prepare statement
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sssi", $CourierName, $Address, $ContactNumber, $CourierID);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "courier updated successfully."]);
            logUserActivity($conn, "Couriers", "Modified courier [$CourierID]", $CourierID);
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
