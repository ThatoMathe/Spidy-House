<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['WarehouseID'])) {
        $WarehouseID = $data['WarehouseID'];

        // Optional: Check and delete related inventory first to avoid foreign key constraint issues
        $conn->begin_transaction();

        try {
            // Delete inventory items linked to this warehouse (optional depending on DB constraints)
            $conn->query("UPDATE inventory SET WarehouseID = NULL WHERE WarehouseID = $WarehouseID;");

            // Delete the warehouse
            $stmt = $conn->prepare("DELETE FROM warehouse WHERE WarehouseID = ?");
            $stmt->bind_param("i", $WarehouseID);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                $conn->commit();
                echo json_encode(["status" => "success", "message" => "Warehouse deleted successfully."]);
                logUserActivity($conn, "Warehouse", "Deleted warehouse [$WarehouseID]", $WarehouseID);
            } else {
                $conn->rollback();
                echo json_encode(["status" => "error", "message" => "Warehouse not found or already deleted."]);
            }

            $stmt->close();
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["status" => "error", "message" => "Error deleting warehouse."]);
        }

        $conn->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Missing WarehouseID."]);
    }

    
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
