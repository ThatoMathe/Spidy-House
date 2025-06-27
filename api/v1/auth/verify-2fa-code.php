<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php'; // Connect to database

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? '';
$code = $data['code'] ?? '';

// Check if session user is set and email matches
if (!isset($_SESSION['user']) || $_SESSION['user']['Email'] !== $email) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

// Check if email or code is empty
if (!$email || !$code) {
    echo json_encode(['success' => false, 'message' => 'Email and code required']);
    exit;
}

// Fetch user by email
$stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit;
}

// Check the stored 2FA code (assumed saved in column `two_fa_code`)
if ((int)$user['two_fa_code'] !== (int)$code) {
    echo json_encode(['success' => false, 'message' => 'Invalid 2FA code']);
    exit;
}


// Mark as verified
$update = $conn->prepare("UPDATE users SET is_2fa_verified = 1 WHERE Email = ?");
$update->bind_param("s", $email);
$update->execute();

// Update session
$_SESSION['user'] = $user;
$_SESSION['user']['is_2fa_verified'] = 1;

echo json_encode(['success' => true, 'message' => '2FA verified']);
