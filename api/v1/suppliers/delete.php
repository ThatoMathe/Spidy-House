<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get and decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['SupplierID']) || !is_numeric($data['SupplierID'])) {
    echo json_encode(['success' => false, 'message' => 'Valid SupplierID is required.']);
    exit;
}

$supplierId = (int)$data['SupplierID'];

// Prepare and execute deletion
$stmt = $conn->prepare("DELETE FROM suppliers WHERE SupplierID = ?");
$stmt->bind_param("i", $supplierId);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Supplier deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Supplier not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
