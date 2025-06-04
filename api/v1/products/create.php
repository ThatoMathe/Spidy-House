<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager, staff');

// Handle file upload and product saving here
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Database connection setup (MySQLi or PDO)
    $productCode = $_POST['productCode'];
    $barcode = $_POST['barcode'];
    $productName = $_POST['productName'];
    $productDescription = $_POST['productDescription'];
    $orderID = $_POST['orderID'];
    $categoryID = $_POST['categoryID'];
    $supplierID = $_POST['supplierID'];
    $productQuantity = $_POST['productQuantity'];

    // Handle product image upload
    $targetDir = $docRoot."/uploads/products/";
    $targetFile = $targetDir . basename($_FILES["productImage"]["name"]);
    move_uploaded_file($_FILES["productImage"]["tmp_name"], $targetFile);

    // Insert into the database
    $query = "INSERT INTO products (ProductCode, BarCode, ProductName, ProductDescription, OrderID, CategoryID, SupplierID, ProductImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    // Use prepared statements for security
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssssiiis", $productCode, $barcode, $productName, $productDescription, $orderID, $categoryID, $supplierID, $targetFile);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Product added successfully.']);
        logUserActivity($conn, "Products", "Added product [$productName]");
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product.']);
    }
}

?>
