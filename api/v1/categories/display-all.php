<?php
// Moves up from /pages/ to root
$docRoot = $_SERVER['DOCUMENT_ROOT']; // Document root of the web server

require_once $docRoot . '/config/db.php'; // Include your database connection

allowOnlyAdmins('super_admin, manager, staff');

function getCategories() {
    global $conn;

    $sql = "SELECT CategoryID, CategoryName FROM categories";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $categories = [];
        while($row = $result->fetch_assoc()) {
            $categories[] = $row;
        }
        return $categories;
    } else {
        return [];
    }
}

// Output the categories as a JSON response
header('Content-Type: application/json'); // Ensure the response is in JSON format
echo json_encode(getCategories(), JSON_PRETTY_PRINT); // Encode the result as JSON
?>