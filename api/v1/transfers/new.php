<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

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

// Check stock availability
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

// Insert into transfers table
$insert = $conn->prepare("INSERT INTO transfers (TransferQuantity, SentDate, ReceivedDate, WarehouseID, FromWarehouseID, StoreID, ProductID) VALUES (?, ?, ?, ?, ?, ?, ?)");
$insert->bind_param(
    "issiiii",
    $quantity,
    $sentDate,
    $receivedDate,
    $warehouseID,
    $fromWarehouseID,
    $storeID,
    $productID
);
if (!$insert->execute()) {
    echo json_encode(['success' => false, 'message' => 'Failed to save transfer']);
    exit;
}
$insert->close();

// Update inventory: subtract from source
$updateFrom = $conn->prepare("UPDATE inventory SET QuantityAvailable = QuantityAvailable - ? WHERE ProductID = ? AND WarehouseID = ?");
$updateFrom->bind_param("iii", $quantity, $productID, $fromWarehouseID);
$updateFrom->execute();
$updateFrom->close();

// Optional: add to destination warehouse
if ($warehouseID) {
    // Check if inventory entry exists
    $checkInv = $conn->prepare("SELECT InventoryID FROM inventory WHERE ProductID = ? AND WarehouseID = ?");
    $checkInv->bind_param("ii", $productID, $warehouseID);
    $checkInv->execute();
    $checkInv->store_result();

    if ($checkInv->num_rows > 0) {
        // Update existing
        $updateTo = $conn->prepare("UPDATE inventory SET QuantityAvailable = QuantityAvailable + ? WHERE ProductID = ? AND WarehouseID = ?");
        $updateTo->bind_param("iii", $quantity, $productID, $warehouseID);
        $updateTo->execute();
        $updateTo->close();
    } else {
        // Insert new
        $insertTo = $conn->prepare("INSERT INTO inventory (ProductID, QuantityAvailable, WarehouseID) VALUES (?, ?, ?)");
        $insertTo->bind_param("iii", $productID, $quantity, $warehouseID);
        $insertTo->execute();
        $insertTo->close();
    }
    $checkInv->close();
}

echo json_encode(['success' => true, 'message' => 'Transfer added successfully']);
?>
