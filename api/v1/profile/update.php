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


// Decode JSON input
$input = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($input['UserName']) || empty($input['Email'])) {
    echo json_encode(['success' => false, 'message' => 'Name and Email are required']);
    exit;
}

$UserName = trim($input['UserName']);
$Email = trim($input['Email']);

// Update query
$sql = "UPDATE users SET UserName = ?, Email = ? WHERE UserID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $UserName, $Email, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile']);
}

$stmt->close();
$conn->close();
