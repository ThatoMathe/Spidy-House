<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

$excludeUserId = $_SESSION['user']['UserID'];

// Query to count and group notifications by title, excluding current user's activity
$sql = "SELECT title, COUNT(*) AS total 
        FROM notifications 
        WHERE user_id != ? 
        GROUP BY title 
        ORDER BY total DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $excludeUserId);
$stmt->execute();

$result = $stmt->get_result();

$groupedNotifications = [];
$overallTotal = 0;

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $count = (int)$row['total'];
        $groupedNotifications[] = [
            'title' => $row['title'],
            'total' => $count
        ];
        $overallTotal += $count;
    }

    echo json_encode([
        'success' => true,
        'overall_total' => $overallTotal,
        'data' => $groupedNotifications
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No notifications found.',
        'overall_total' => 0
    ]);
}

$stmt->close();
$conn->close();
?>
