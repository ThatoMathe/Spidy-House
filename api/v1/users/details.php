<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager, staff');

$id = $_GET['id'] ?? null;

if (!$id) {
    echo json_encode(['error' => 'Missing user ID']);
    exit;
}

$userQuery = "
SELECT 
  u.UserID,
  u.UserName,
  u.Email,
  u.Role,
  u.CreatedDate,
  w.WarehouseName,
  w.WarehouseID,
  w.LocationName,
  w.LocationAddress
FROM users u
LEFT JOIN warehouse w ON u.WarehouseID = w.WarehouseID
WHERE u.UserID = ?;
";

$stmt = $conn->prepare($userQuery);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

echo json_encode($user ?: []);
