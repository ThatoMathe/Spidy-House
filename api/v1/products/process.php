<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager, staff');

// === VALIDATE REQUIRED FIELDS ===
$required = ['barcode', 'productName', 'categoryID', 'supplierID', 'QuantityAvailable', 'LastOrderDate', 'inventoryID'];
foreach ($required as $field) {
  if (empty($_POST[$field])) {
    echo json_encode(["success" => false, "message" => "Missing field: $field"]);
    exit;
  }
}

// === SANITIZE & PARSE INPUT ===
$barcode = $conn->real_escape_string($_POST['barcode']);
$productName = $conn->real_escape_string($_POST['productName']);
$productDescription = isset($_POST['productDescription']) ? $conn->real_escape_string($_POST['productDescription']) : null;
$orderID = isset($_POST['orderID']) ? intval($_POST['orderID']) : null;
$categoryID = intval($_POST['categoryID']);
$supplierID = intval($_POST['supplierID']);
$inventoryID = intval($_POST['inventoryID']);
$quantity = intval($_POST['QuantityAvailable']);
$lastOrderDate = $_POST['LastOrderDate'];

// === IMAGE UPLOAD ===
$imagePath = null;
if (isset($_FILES['productImage']) && $_FILES['productImage']['error'] === UPLOAD_ERR_OK) {
  $uploadDir = '../../../uploads/products/';

  if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }
  $filename = uniqid() . '_' . basename($_FILES['productImage']['name']);
  $fullPath = $uploadDir . $filename;

  if (move_uploaded_file($_FILES['productImage']['tmp_name'], $fullPath)) {
    $imagePath = $filename;
  } else {
    echo json_encode(["success" => false, "message" => "Image upload failed"]);
    exit;
  }
}

// === INSERT PRODUCT (without ProductCode) ===
$productInsert = $conn->prepare("
  INSERT INTO products (
    BarCode, ProductName, ProductDescription, OrderID,
    ProductImage, CategoryID, SupplierID
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
");
$productInsert->bind_param(
  "ssssssi",
  $barcode,
  $productName,
  $productDescription,
  $orderID,
  $imagePath,
  $categoryID,
  $supplierID
);

if (!$productInsert->execute()) {
  echo json_encode(["success" => false, "message" => "Product insert failed: " . $productInsert->error]);
  exit;
}

$productID = $productInsert->insert_id;
$productCode = "P" . $productID;
$productInsert->close();

// === UPDATE ProductCode ===
$codeUpdate = $conn->prepare("UPDATE products SET ProductCode = ? WHERE ProductID = ?");
$codeUpdate->bind_param("si", $productCode, $productID);
$codeUpdate->execute();
$codeUpdate->close();

// === UPDATE EXISTING INVENTORY ===
$inventoryUpdate = $conn->prepare("
  UPDATE inventory SET
    ProductID = ?, QuantityAvailable = ?, LastOrderDate = ?
  WHERE InventoryID = ?
");
$inventoryUpdate->bind_param("iisi", $productID, $quantity, $lastOrderDate, $inventoryID);

if (!$inventoryUpdate->execute()) {
  echo json_encode(["success" => false, "message" => "Inventory update failed: " . $inventoryUpdate->error]);
  exit;
}

$inventoryUpdate->close();

// === RESPONSE ===
echo json_encode([
  "success" => true,
  "productID" => $productID,
  "productCode" => $productCode,
  "message" => "Product and inventory updated successfully."
]);
logUserActivity($conn, "Products", "Proccesed product [$productID]");

$conn->close();
?>
