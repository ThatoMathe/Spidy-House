<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get Transfer ID
$id = isset($_GET['TransferID']) ? intval($_GET['TransferID']) : 0;
if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid Transfer ID']);
    exit;
}

// 1. Get Transfer Info
$sql = "
    SELECT
        t.TransferID,
        t.ProductID,
        t.TransferQuantity,
        COALESCE(t.FromWarehouseID, t.WarehouseID) AS ReturnToWarehouseID
    FROM transfers t
    WHERE t.TransferID = ?
    LIMIT 1
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$transfer = $result->fetch_assoc();
$stmt->close();

if (!$transfer) {
    echo json_encode(['success' => false, 'message' => 'Transfer not found']);
    exit;
}

$productId = $transfer['ProductID'];
$quantity = $transfer['TransferQuantity'];
$warehouseId = $transfer['ReturnToWarehouseID'];

// 2. Check if inventory record exists
$checkSql = "SELECT InventoryID FROM inventory WHERE ProductID = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("i", $productId);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();
$inventoryRow = $checkResult->fetch_assoc();
$checkStmt->close();

if ($inventoryRow) {
    // 2a. Update existing inventory
    $inventoryId = $inventoryRow['InventoryID'];
    $updateSql = "UPDATE inventory SET QuantityAvailable = QuantityAvailable + ? WHERE InventoryID = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("ii", $quantity, $inventoryId);
    $updateSuccess = $updateStmt->execute();
    $updateStmt->close();
} else {
    // 2b. Insert new inventory record
    $insertSql = "INSERT INTO inventory (ProductID, QuantityAvailable, WarehouseID) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("iii", $productId, $quantity, $warehouseId);
    $updateSuccess = $insertStmt->execute();
    $inventoryId = $insertStmt->insert_id;
    $insertStmt->close();
}

// 3. Log into stockreturns
$reason = "Returned from transfer cancellation";
$logSql = "INSERT INTO stockreturns (ProductID, Quantity, ReasonForReturn, InventoryID) VALUES (?, ?, ?, ?)";
$logStmt = $conn->prepare($logSql);
$logStmt->bind_param("issi", $productId, $quantity, $reason, $inventoryId);
$logStmt->execute();
$logStmt->close();

// 4. Delete the transfer
$deleteSql = "DELETE FROM transfers WHERE TransferID = ?";
$delStmt = $conn->prepare($deleteSql);
$delStmt->bind_param("i", $id);
$deleteSuccess = $delStmt->execute();
$delStmt->close();

if ($updateSuccess && $deleteSuccess) {
    logUserActivity($conn, "Returns", "Transfer deleted and stock returned to inventory [$inventoryId]", $inventoryId);
    echo json_encode([
        'success' => true,
        'message' => 'Transfer deleted and stock returned to inventory',
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to process return',
    ]);
}
?>
