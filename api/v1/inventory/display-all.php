


<?php
// Secure Inventory Fetch Script
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Set JSON header
header('Content-Type: application/json');

// Disable error display in response (log only)
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Allow only specified roles
allowOnlyAdmins('admin, manager, staff');

function getInventory($conn)
{
    $sql = "
        SELECT 
            i.InventoryID,
            p.ProductName,
            p.BarCode,
            i.QuantityAvailable,
            i.MinimumStockLevel,
            i.MaximumStockLevel,
            i.SupplierID,
            s.SupplierName,
            w.WarehouseName,
            w.WarehouseID,
            i.LastOrderDate
        FROM inventory i
        LEFT JOIN products p ON i.ProductID = p.ProductID
        LEFT JOIN suppliers s ON i.SupplierID = s.SupplierID
        LEFT JOIN warehouse w ON i.WarehouseID = w.WarehouseID
        ORDER BY i.InventoryID DESC
    ";

    try {
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare SQL statement");
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $inventory = [];
        while ($row = $result->fetch_assoc()) {
            $inventory[] = $row; // Remove htmlspecialchars if JSON needed
        }

        $stmt->close();
        return $inventory;

    } catch (Exception $e) {
        error_log("Inventory fetch error: " . $e->getMessage());
        http_response_code(500);
        return ["error" => "Internal Server Error"];
    }
}

// Output the JSON
echo json_encode(getInventory($conn), JSON_PRETTY_PRINT);
