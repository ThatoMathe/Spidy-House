<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('admin, manager');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['ReportID'])) {
    echo json_encode(['success' => false, 'error' => 'Missing ReportID']);
    exit;
}

$reportID = $data['ReportID'];

$stmt = $conn->prepare("DELETE FROM useractivity WHERE ReportID = ?");
$stmt->bind_param("i", $reportID);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
