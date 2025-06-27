<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin,manager'); // Optional if you use access control

header('Content-Type: application/json');

// Get JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
$product_id     = isset($data['product_id']) ? (int)$data['product_id'] : 0;
$supplier_id    = isset($data['supplier_id']) ? (int)$data['supplier_id'] : 0;
$order_quantity = isset($data['order_quantity']) ? (int)$data['order_quantity'] : 0;
$expected_date  = isset($data['expected_date']) ? $data['expected_date'] : '';

if (!$product_id || !$supplier_id || !$order_quantity || !$expected_date) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Insert into purchasingorders table
$sql = "
    INSERT INTO purchasingorders (ProductID, SupplierID, OrderQuantity, ExpectedDate, OrderDate, Status)
    VALUES (?, ?, ?, ?, NOW(), 'Pending')
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iiis", $product_id, $supplier_id, $order_quantity, $expected_date);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Purchase order created successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
}

$stmt->close();
