<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, manager');

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->InventoryID)) {
    echo json_encode(["success" => false, "message" => "Missing InventoryID"]);
    exit;
}

$InventoryID = (int)$data->InventoryID;
$stmt = $conn->prepare("DELETE FROM inventory WHERE InventoryID = ?");
$stmt->bind_param("i", $InventoryID);
$success = $stmt->execute();

echo json_encode(["success" => $success]);
logUserActivity($conn, "Inventory", "Deleted inventory");

$stmt->close();
$conn->close();
?>
