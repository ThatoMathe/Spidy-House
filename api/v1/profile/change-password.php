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

// Get input
$data = json_decode(file_get_contents("php://input"), true);
$current = trim($data['current_password'] ?? '');
$new = trim($data['new_password'] ?? '');
$confirm = trim($data['confirm_password'] ?? '');

// Validate
if (!$current || !$new || !$confirm) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

if ($new !== $confirm) {
    echo json_encode(['success' => false, 'message' => 'New password and confirmation do not match']);
    exit;
}

// Get current hashed password
$stmt = $conn->prepare("SELECT Password FROM users WHERE UserID = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $hashed = $row['Password'];

    if (!password_verify($current, $hashed)) {
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
        exit;
    }

    $newHash = password_hash($new, PASSWORD_DEFAULT);

    $update = $conn->prepare("UPDATE users SET Password = ? WHERE UserID = ?");
    $update->bind_param("si", $newHash, $userId);

    if ($update->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }

    $update->close();
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$stmt->close();
$conn->close();
