<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$productID   = $_POST['productID'] ?? '';
$productName = $_POST['ProductName'] ?? '';
$barCode     = $_POST['BarCode'] ?? '';
$imageFile   = $_FILES['ProductImage'] ?? null;

if (! $productID || ! $productName || ! $barCode) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Handle image upload
$imageFilename = null;

if ($imageFile && $imageFile['error'] === UPLOAD_ERR_OK) {
    $ext = pathinfo($imageFile['name'], PATHINFO_EXTENSION);
    $imageFilename = 'product_' . time() . '_' . rand(1000, 9999) . '.' . $ext;

    $uploadDir = $docRoot . '/uploads/products/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadPath = $uploadDir . $imageFilename;
    move_uploaded_file($imageFile['tmp_name'], $uploadPath);
}


// Prepare the update query
if ($imageFilename) {
    $imageFilename = "/uploads/products/" . $imageFilename;
    $stmt          = $conn->prepare("UPDATE products SET ProductName = ?, BarCode = ?, ProductImage = ? WHERE ProductID = ?");
    $stmt->bind_param("sssi", $productName, $barCode, $imageFilename, $productID);
} else {
    $stmt = $conn->prepare("UPDATE products SET ProductName = ?, BarCode = ? WHERE ProductID = ?");
    $stmt->bind_param("ssi", $productName, $barCode, $productID);
}

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
    logUserActivity($conn, "Products", "Modified product [$productID]", $productID);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update product']);
}

$stmt->close();
$conn->close();
