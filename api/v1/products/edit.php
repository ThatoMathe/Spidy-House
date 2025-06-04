<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Make sure it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get data from request
$productID = $_POST['productID'] ?? '';
$productName = $_POST['ProductName'] ?? '';
$barCode = $_POST['BarCode'] ?? '';

// Validate inputs
if (!$productID || !$productName || !$barCode) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Prepare the update query
$stmt = $conn->prepare("UPDATE products SET ProductName = ?, BarCode = ? WHERE ProductID = ?");
$stmt->bind_param("ssi", $productName, $barCode, $productID);

// Execute and respond
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    logUserActivity($conn, "Products", "Modified product [$productID]");
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update product']);
}

$stmt->close();
$conn->close();
