<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['CourierName'], $data['ContactNumber'], $data['Address'])) {
    $CourierName = $data['CourierName'];
    $ContactNumber = $data['ContactNumber'];
    $Address = $data['Address'];

    $query = "INSERT INTO courier (CourierName, ContactNumber, Address) VALUES (?, ?, ?)";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sss", $CourierName, $ContactNumber, $Address);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Courier added successfully."]);
            logUserActivity($conn, "Couriers", "Added courier");
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add courier."]);
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
