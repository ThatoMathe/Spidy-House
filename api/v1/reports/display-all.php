<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

function getReports($conn) {
    $sql = "
        SELECT 
            ua.ReportID, 
            ua.UserID, 
            u.UserName AS Username, 
            DATE(ua.CreatedAt) AS Date,
            TIME(ua.CreatedAt) AS Time,
            ua.Title, 
            ua.Description
        FROM useractivity ua
        LEFT JOIN users u ON ua.UserID = u.UserID
        ORDER BY ua.CreatedAt DESC
    ";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $reports = [];
        while ($row = $result->fetch_assoc()) {
            $reports[] = $row;
        }
        return $reports;
    }

    return []; // No records found
}

try {
    echo json_encode(getReports($conn), JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error fetching activity logs"
    ], JSON_PRETTY_PRINT);
}
?>
