<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
if (empty($data['SupplierName']) || empty($data['SupplierAddress'])) {
    echo json_encode(['success' => false, 'message' => 'Supplier name and address are required.']);
    exit;
}

$supplierName = trim($data['SupplierName']);
$supplierAddress = trim($data['SupplierAddress']);

// Prepare SQL insert
$stmt = $conn->prepare("INSERT INTO suppliers (SupplierName, SupplierAddress) VALUES (?, ?)");
$stmt->bind_param("ss", $supplierName, $supplierAddress);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Supplier added successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
