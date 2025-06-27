<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');


// Get the JSON body data
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (
    isset($data['UserName'], $data['Email'], $data['Password'], $data['Role'], $data['WarehouseID']) &&
    !empty($data['UserName']) &&
    !empty($data['Email']) &&
    !empty($data['Password']) &&
    !empty($data['Role']) &&
    !empty($data['WarehouseID'])
) {
    $userName = trim($data['UserName']);
    $email = trim($data['Email']);
    $password = password_hash($data['Password'], PASSWORD_DEFAULT); // Secure hash
    $role = trim($data['Role']);
    $warehouseID = (int) $data['WarehouseID'];

    // Prepare SQL insert
    $query = "INSERT INTO users (UserName, Email, Password, Role, WarehouseID) VALUES (?, ?, ?, ?, ?)";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ssssi", $userName, $email, $password, $role, $warehouseID);

        if ($stmt->execute()) {
            $userId = $stmt->insert_id;

            echo json_encode([
                "status" => "success",
                "message" => "User added successfully.",
                "id" => $userId
            ]);

            logUserActivity($conn, "Users", "Added user [$userName] to warehouse [$warehouseID]", $userId);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to insert user."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to prepare statement."]);
    }

    $conn->close();
} else {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
}
?>
