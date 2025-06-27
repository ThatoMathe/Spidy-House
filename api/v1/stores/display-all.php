<?php
    $docRoot = $_SERVER['DOCUMENT_ROOT'];
    require_once $docRoot . '/config/db.php';

    allowOnlyAdmins('admin, manager, staff');

    function getStoresWithDetails($conn) {
        $sql = "
            SELECT 
                s.StoreID,
                s.StoreName,
                s.StoreLocation,
                s.CreatedDate,
                s.ManagerID,
                u.UserName AS ManagerName
            FROM stores s
            LEFT JOIN users u ON s.ManagerID = u.UserID
        ";

        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $stores = [];
            while ($row = $result->fetch_assoc()) {
                $stores[] = $row;
            }
            return $stores;
        }

        return []; // No records found
    }

    try {
        echo json_encode(getStoresWithDetails($conn), JSON_PRETTY_PRINT);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error fetching stores"
        ], JSON_PRETTY_PRINT);
    }
?>
