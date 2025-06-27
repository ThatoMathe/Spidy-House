<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

// Check if user is logged in and session ID exists
if (!isset($_SESSION['user']['UserID']) || !isset($_SESSION['user']['session_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user']['UserID'];
$currentSessionId = $_SESSION['user']['session_id'];

// Get basic user info + latest login session
$sql = "
    SELECT 
        u.UserName AS full_name,
        u.Email AS email,
        u.Role AS role,
        u.is_2fa_enabled,
        s.CreatedAt AS login_time
    FROM users u
    LEFT JOIN session s ON u.UserID = s.UserID
    WHERE u.UserID = ?
    ORDER BY s.CreatedAt DESC
    LIMIT 1
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$userData = $result->fetch_assoc() ?: [];
$stmt->close();

// Get all sessions for the user
$sessions = [];
$sessSql = "
    SELECT Token, IPAddress, UserAgent, CreatedAt, ResentDate
    FROM session
    WHERE UserID = ?
    ORDER BY CreatedAt DESC
";
$sessStmt = $conn->prepare($sessSql);
$sessStmt->bind_param("i", $userId);
$sessStmt->execute();
$sessResult = $sessStmt->get_result();

while ($row = $sessResult->fetch_assoc()) {
    $sessions[] = $row;
}
$sessStmt->close();
$conn->close();

// Return response
if ($userData) {
    echo json_encode([
        'success' => true,
        'full_name' => $userData['full_name'],
        'email' => $userData['email'],
        'role' => $userData['role'],
        'is_2fa_enabled' => $userData['is_2fa_enabled'],
        'login_time' => $userData['login_time'],
        'sessions' => $sessions,
        'current_session_id' => $currentSessionId
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}
