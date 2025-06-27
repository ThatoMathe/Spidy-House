<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

function getStoreLatestTransfer($storeID) {
    global $conn;

    $sql = "
        SELECT 
            p.ProductName,
            w.WarehouseName,
            t.TransferQuantity,
            t.ReceivedDate
        FROM transfers t
        INNER JOIN products p ON t.ProductID = p.ProductID
        INNER JOIN warehouse w ON t.FromWarehouseID = w.WarehouseID
        WHERE t.StoreID = ?
        AND t.ReceivedDate IS NOT NULL
        ORDER BY t.ReceivedDate DESC
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        return ['success' => false, 'message' => 'Failed to prepare SQL statement'];
    }

    $stmt->bind_param("i", $storeID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        return $row;
    } else {
        return ['success' => false, 'message' => 'No transfer records found'];
    }
}

// Read input
$data = json_decode(file_get_contents('php://input'), true);
$storeID = $data['StoreID'] ?? null;

if (!$storeID) {
    echo json_encode(['success' => false, 'message' => 'Missing StoreID']);
    exit;
}

// Return JSON
echo json_encode(getStoreLatestTransfer($storeID), JSON_PRETTY_PRINT);
?>
