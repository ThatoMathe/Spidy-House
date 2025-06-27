<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (isset($data['WarehouseID'], $data['WarehouseName'], $data['LocationName'], $data['LocationAddress'])) {
    $WarehouseID = $data['WarehouseID'];
    $WarehouseName = $data['WarehouseName'];
    $LocationName = $data['LocationName'];
    $LocationAddress = $data['LocationAddress'];

    // Update the warehouse record
    $query = "UPDATE warehouse SET WarehouseName = ?, LocationName = ?, LocationAddress = ? WHERE WarehouseID = ?";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sssi", $WarehouseName, $LocationName, $LocationAddress, $WarehouseID);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Warehouse updated successfully."]);
            logUserActivity($conn, "Warehouse", "Updated warehouse [$WarehouseID]", $WarehouseID);

        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update warehouse."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement."]);
    }

    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
}
