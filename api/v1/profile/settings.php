<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager, staff');

// Check if user is logged in
if (!isset($_SESSION['user']['UserID'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user']['UserID'];

// Get user info
$sql = "
    SELECT 
        u.UserName AS full_name,
        u.Email AS email,
        u.Role AS role,
        u.is_2fa_enabled,
        s.IPAddress,
        s.UserAgent,
        s.CreatedAt AS login_time
    FROM users u
    LEFT JOIN session s ON u.UserID = s.UserID
    WHERE u.UserID = ?
    ORDER BY s.CreatedAt DESC
    LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $row['success'] = true;
        echo json_encode($row);
    } else {
        echo json_encode(['success' => false, 'message' => 'Session not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'DB error']);
}

$stmt->close();
$conn->close();
