<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

$id = $_GET['CourierID'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Missing courier ID']);
    exit;
}

$userQuery = "
      SELECT 
            CourierID,
            CourierName,
            Address,
            ContactNumber
        FROM courier
WHERE CourierID = ?;
";

$stmt = $conn->prepare($userQuery);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$courier = $result->fetch_assoc();
$stmt->close();

echo json_encode($courier ?: []);
