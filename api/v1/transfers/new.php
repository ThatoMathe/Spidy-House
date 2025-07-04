<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Validate required fields
$required = ['ProductID', 'TransferQuantity', 'FromWarehouseID', 'ReceivedDate'];
foreach ($required as $field) {
    if (empty($_POST[$field])) {
        echo json_encode(['success' => false, 'message' => "Missing: $field"]);
        exit;
    }
}

$productID = (int) $_POST['ProductID'];
$quantity = (int) $_POST['TransferQuantity'];
$fromWarehouseID = (int) $_POST['FromWarehouseID'];
$receivedDate = $_POST['ReceivedDate'];
$sentDate = date('Y-m-d H:i:s');

$warehouseID = !empty($_POST['WarehouseID']) ? (int) $_POST['WarehouseID'] : null;
$storeID = !empty($_POST['StoreID']) ? (int) $_POST['StoreID'] : null;

// Check stock availability in source warehouse
$check = $conn->prepare("SELECT QuantityAvailable FROM inventory WHERE ProductID = ? AND WarehouseID = ?");
$check->bind_param("ii", $productID, $fromWarehouseID);
$check->execute();
$check->bind_result($availableQty);
$check->fetch();
$check->close();

if ($availableQty < $quantity) {
    echo json_encode(['success' => false, 'message' => 'Not enough stock in the source warehouse']);
    exit;
}

// Record transfer (log only)
$insert = $conn->prepare("INSERT INTO transfers (TransferQuantity, SentDate, ReceivedDate, WarehouseID, FromWarehouseID, StoreID, ProductID) VALUES (?, ?, ?, ?, ?, ?, ?)");
$insert->bind_param("issiiii", $quantity, $sentDate, $receivedDate, $warehouseID, $fromWarehouseID, $storeID, $productID);
if (!$insert->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to save transfer']);
    exit;
}
$insert->close();

// Subtract from source inventory only
$updateFrom = $conn->prepare("UPDATE inventory SET QuantityAvailable = QuantityAvailable - ? WHERE ProductID = ? AND WarehouseID = ?");
$updateFrom->bind_param("iii", $quantity, $productID, $fromWarehouseID);
$updateFrom->execute();
$updateFrom->close();

// Do NOT add anything to the destination warehouse inventory
logUserActivity($conn, "Returns", "Stock transferred out successfully - Product [$productID]", $productID);
echo json_encode(['success' => true, 'message' => 'Stock transferred out successfully (no receiving update)']);
?>
