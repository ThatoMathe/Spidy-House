<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Only allow certain roles to delete
allowOnlyAdmins('admin, manager, staff');

// Ensure request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get ProductID from POST
$productID = $_POST['productID'] ?? null;

if (!$productID || !is_numeric($productID)) {
    echo json_encode(['success' => false, 'message' => 'Invalid product ID']);
    exit;
}

// Get image path (if any)
$getImage = $conn->prepare("SELECT ProductImage FROM products WHERE ProductID = ?");
$getImage->bind_param("i", $productID);
$getImage->execute();
$getResult = $getImage->get_result();
$imageRow = $getResult->fetch_assoc();
$getImage->close();

// Optional: Delete associated image
if (!empty($imageRow['ProductImage'])) {
    $imagePath = $docRoot . '/uploads/' . basename($imageRow['ProductImage']);
    if (file_exists($imagePath)) {
        unlink($imagePath);
    }
}

// Delete product from DB
$stmt = $conn->prepare("DELETE FROM products WHERE ProductID = ?");
$stmt->bind_param("i", $productID);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Product deleted successfully.']);
    logUserActivity($conn, "Products", "Deleted product [$productID]", $productID);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete product.']);
}

$stmt->close();
$conn->close();
