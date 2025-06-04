<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Read input
$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');

// Validate input
if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

sendTwoFactorCode($conn, $email);

