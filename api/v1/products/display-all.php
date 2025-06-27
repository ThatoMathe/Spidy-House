<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once($docRoot . '/config/db.php');

allowOnlyAdmins('admin, manager, staff');

function getProductsWithDetails() {
    global $conn;

    $sql = "
        SELECT 
            p.ProductID,
            p.ProductCode,
            p.BarCode,
            p.ProductName,
            p.ProductDescription,
            p.ProductImage,
            p.CategoryID,
            c.CategoryName,
            s.SupplierName,
            i.QuantityAvailable,
            i.MinimumStockLevel,
            i.MaximumStockLevel,
            i.LastOrderDate,
            w.WarehouseName,
            w.LocationName,
            w.LocationAddress
        FROM products p
        LEFT JOIN categories c ON p.CategoryID = c.CategoryID
        LEFT JOIN suppliers s ON p.SupplierID = s.SupplierID
        LEFT JOIN inventory i ON p.ProductID = i.ProductID
        LEFT JOIN warehouse w ON i.WarehouseID = w.WarehouseID
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $products = [];
        while($row = $result->fetch_assoc()) {
            $products[] = $row;
        }
        return $products;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getProductsWithDetails(), JSON_PRETTY_PRINT);
?>
