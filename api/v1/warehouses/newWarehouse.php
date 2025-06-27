<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Check if the required data is provided
if (isset($data['WarehouseName'], $data['LocationName'], $data['LocationAddress'])) {
    $WarehouseName = $data['WarehouseName'];
    $LocationName = $data['LocationName'];
    $LocationAddress = $data['LocationAddress'];

    // Correct INSERT syntax
    $query = "INSERT INTO warehouse (WarehouseName, LocationName, LocationAddress) VALUES (?, ?, ?)";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("sss", $WarehouseName, $LocationName, $LocationAddress);

        if ($stmt->execute()) {
            $warehouseId = $stmt->insert_id; // Get new ID

            echo json_encode([
                "status" => "success",
                "message" => "Warehouse added successfully.",
                "id" => $warehouseId
            ]);

            logUserActivity($conn, "Warehouse", "Added new warehouse [$warehouseId]", $warehouseId);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add warehouse."]);
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
