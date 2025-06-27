<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

// Handle file upload and product saving here
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Database connection setup (MySQLi or PDO)
    $productCode        = $_POST['productCode'];
    $barcode            = $_POST['barcode'];
    $productName        = $_POST['productName'];
    $productDescription = $_POST['productDescription'];
    $orderID            = $_POST['orderID'];
    $categoryID         = $_POST['categoryID'];
    $supplierID         = $_POST['supplierID'];
    $productQuantity    = $_POST['productQuantity'];

    // Handle product image upload
    $targetDir = $docRoot . "/uploads/products/";

// Create the folder if it doesn't exist
    if (! is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

// Sanitize and generate a unique filename
    $originalName = basename($_FILES["productImage"]["name"]);
    $ext          = pathinfo($originalName, PATHINFO_EXTENSION);
    $uniqueName   = 'product_' . time() . '_' . rand(1000, 9999) . '.' . $ext;

    $targetFile = $targetDir . $uniqueName;

    if (move_uploaded_file($_FILES["productImage"]["tmp_name"], $targetFile)) {
        // Success - you can now store $uniqueName in the database
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
        exit;
    }

    $targetFile='/uploads/products/'.$targetFile;

    // Insert into the database
    $query = "INSERT INTO products (ProductCode, BarCode, ProductName, ProductDescription, OrderID, CategoryID, SupplierID, ProductImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    // Use prepared statements for security
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssiiis", $productCode, $barcode, $productName, $productDescription, $orderID, $categoryID, $supplierID, $targetFile);

    if ($stmt->execute()) {
        $newProductID = $stmt->insert_id; // Get the new product ID
        echo json_encode([
            'success' => true,
            'message' => 'Product added successfully.',
            'id' => $newProductID
        ]);

        logUserActivity($conn, "Products", "Added product [$newProductID]", $newProductID);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product.']);
    }
}
