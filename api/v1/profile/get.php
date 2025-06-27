<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

// Check if user is logged in
if (!isset($_SESSION['user']['UserID'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user']['UserID'];

$sql = "
    SELECT 
        u.UserID,
        u.UserName,
        u.Email,
        u.Role,
        u.is_2fa_enabled,
        w.WarehouseName
    FROM users u
    LEFT JOIN warehouse w ON u.WarehouseID = w.WarehouseID
    WHERE u.UserID = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'data' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database error']);
}

$stmt->close();
$conn->close();
