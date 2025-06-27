<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager');
header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

$order_id    = isset($data['order_id']) ? (int)$data['order_id'] : 0;
$status      = isset($data['status']) ? $data['status'] : '';
$actual_date = isset($data['actual_date']) ? $data['actual_date'] : null;

if (!$order_id || !in_array($status, ['Pending', 'Approved', 'Rejected'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

$sql = "UPDATE purchasingorders SET Status = ?, ActualDate = ? WHERE OrderID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssi", $status, $actual_date, $order_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Order updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update order']);
}
$stmt->close();
