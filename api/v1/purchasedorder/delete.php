<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$orderId = isset($data['order_id']) ? (int)$data['order_id'] : 0;

if (!$orderId) {
    echo json_encode(['success' => false, 'message' => 'Missing order ID']);
    exit;
}

// Optional: delete related products from `products` if needed

$sql = "DELETE FROM purchasingorders WHERE OrderID = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $orderId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Order deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete order']);
}

$stmt->close();
