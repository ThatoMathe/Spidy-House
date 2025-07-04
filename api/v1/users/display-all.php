<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Restrict access
allowOnlyAdmins('admin,manager'); // Ensure only admin or manager can access

function getUsers() {
    global $conn;

    // Explicitly select only non-sensitive columns
    $sql = "
        SELECT 
            UserID,
            UserName,
            Email,
            Role,
            WarehouseID,
            is_2fa_enabled,
            is_2fa_verified,
            CreatedDate
        FROM users
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        return ["error" => "Failed to prepare query."];
    }

    if (!$stmt->execute()) {
        http_response_code(500);
        return ["error" => "Failed to execute query."];
    }

    $result = $stmt->get_result();
    $users = [];

    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }

    return $users;
}

echo json_encode(getUsers(), JSON_PRETTY_PRINT);
?>
