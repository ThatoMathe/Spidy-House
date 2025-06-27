<?php
// Load database connection
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

// Get Transfer ID from query
$id = isset($_GET['TransferID']) ? intval($_GET['TransferID']) : 0;

if ($id <= 0) {
    echo json_encode(['error' => 'Missing or invalid Transfer ID']);
    exit;
}

$sql = "
    SELECT
        t.TransferID,
        t.TransferQuantity,
        t.SentDate,
        t.ReceivedDate,

        -- Product info
        p.ProductName,
        p.ProductCode,
        p.BarCode,
        p.ProductDescription,
        p.ProductImage,

        -- Destination: To warehouse
        w.WarehouseName,
        w.LocationName,
        w.LocationAddress,

        -- Destination: To store
        s.StoreName,
        s.StoreLocation,

        -- Source: From warehouse
        fw.WarehouseName AS FromWarehouseName,

        -- Source: From store
        fs.StoreName AS ToStoreName

    FROM transfers t
    JOIN products p ON t.ProductID = p.ProductID
    LEFT JOIN warehouse w ON t.WarehouseID = w.WarehouseID
    LEFT JOIN stores s ON t.StoreID = s.StoreID
    LEFT JOIN warehouse fw ON t.FromWarehouseID = fw.WarehouseID
    LEFT JOIN stores fs ON t.StoreID = fs.StoreID

    WHERE t.TransferID = ?
    LIMIT 1
";

if ($stmt = $conn->prepare($sql)) {
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_assoc();

    // Optional logic to detect where it was transferred TO
    if ($data) {
        if (!empty($data['StoreName'])) {
            $data['DestinationType'] = 'Store';
        } elseif (!empty($data['WarehouseName'])) {
            $data['DestinationType'] = 'Warehouse';
        } else {
            $data['DestinationType'] = 'Unknown';
        }
    }

    echo json_encode($data ?: []);
    $stmt->close();
} else {
    echo json_encode(['error' => 'Failed to prepare statement']);
}
?>
