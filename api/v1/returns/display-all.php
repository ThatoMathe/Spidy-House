<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

function getStockReturnsWithDetails($conn) {
    $sql = "
        SELECT
            sr.StockReturnID,
            p.ProductCode,
            p.ProductName,
            sr.Quantity,
            sr.ReasonForReturn,
            sr.InventoryID
        FROM stockreturns sr
        JOIN products p ON sr.ProductID = p.ProductID
        ORDER BY sr.StockReturnID DESC
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $returns = [];
        while ($row = $result->fetch_assoc()) {
            $returns[] = $row;
        }
        return $returns;
    }

    return [];
}

try {
    $returns = getStockReturnsWithDetails($conn);
    echo json_encode($returns, JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error fetching stock returns",
        "error" => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
