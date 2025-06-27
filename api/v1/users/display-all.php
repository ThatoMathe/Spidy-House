<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';


allowOnlyAdmins('admin, manager');

function getUsers() {
    global $conn;

    $sql = "
        SELECT 
            *
        FROM users";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $users = [];
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
        return $users;
    } else {
        return [];
    }
}

header('Content-Type: application/json');
echo json_encode(getUsers(), JSON_PRETTY_PRINT);
?>
