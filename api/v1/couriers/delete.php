<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Check if it's a POST request and contains the 'action' parameter
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read the JSON input from the body
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if 'action' is 'delete' and 'id' is provided
    if (isset($data['action']) && $data['action'] === 'delete' && isset($data['id'])) {
        $CourierID = $data['id'];

        // SQL query to delete the user
        $query = "DELETE FROM courier WHERE CourierID = ?";

        // Prepare statement
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param("i", $CourierID);
            
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "message" => "User deleted successfully."]);
                logUserActivity($conn, "Couriers", "Deleted courier");
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to delete user."]);
            }
            
            $stmt->close();
        } else {
            echo json_encode(["status" => "error", "message" => "Database query failed."]);
        }

        $conn->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid request."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

?>
