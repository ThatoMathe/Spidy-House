<?php
header('Content-Type: application/json');

$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get logged-in user's ID
$currentUserId = $_SESSION['user']['UserID'] ?? 0;

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);
$title = trim($data['title'] ?? '');

if (empty($title)) {
    echo json_encode([
        'success' => false,
        'message' => 'Title is required.'
    ]);
    exit;
}

// Only delete notifications not created by the current user
$stmt = $conn->prepare("DELETE FROM notifications WHERE title = ? AND user_id != ?");
$stmt->bind_param("si", $title, $currentUserId);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => "Other users' notifications with title [$title] removed.",
        'deleted_count' => $stmt->affected_rows
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to delete notifications.'
    ]);
}

$stmt->close();
$conn->close();
?>
