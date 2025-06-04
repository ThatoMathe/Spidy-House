<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

allowOnlyAdmins('super_admin, admin');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['ReportID'])) {
    echo json_encode(['success' => false, 'error' => 'Missing ReportID']);
    exit;
}

$reportID = $data['ReportID'];
$title = $data['Title'] ?? '';
$description = $data['Description'] ?? '';

$stmt = $conn->prepare("UPDATE useractivity SET Title = ?, Description = ? WHERE ReportID = ?");
$stmt->bind_param("ssi", $title, $description, $reportID);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $stmt->error]);
}
