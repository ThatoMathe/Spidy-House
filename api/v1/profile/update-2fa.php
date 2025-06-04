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
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['enable_2fa'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$isEnabled = $data['enable_2fa'] ? 1 : 0;

$stmt = $conn->prepare("UPDATE users SET is_2fa_enabled = ? WHERE UserID = ?");
$stmt->bind_param("ii", $isEnabled, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update 2FA']);
}

$stmt->close();
$conn->close();
