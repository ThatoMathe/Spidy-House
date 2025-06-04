<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

$uploadDir = $docRoot . '/uploads/logos/';
$jsonFile = __DIR__ . '/site-settings.json';

// Create directory if it doesn't exist
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0775, true);
}

header('Content-Type: application/json');

// Check for file
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'error' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['image'];

// Validate image
$imageInfo = getimagesize($file['tmp_name']);
if (!$imageInfo) {
    echo json_encode(['success' => false, 'error' => 'Invalid image']);
    exit;
}

$width = $imageInfo[0];
$height = $imageInfo[1];

// Check exact size
if ($width != 300 || $height != 300) {
    echo json_encode(['success' => false, 'error' => 'Image must be exactly 300x300']);
    exit;
}

// Save file
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$newName = 'logo_300.' . $ext;
$target = $uploadDir . $newName;
$url = '/uploads/logos/' . $newName;

if (move_uploaded_file($file['tmp_name'], $target)) {
    // Update site-settings.json
    $settings = file_exists($jsonFile)
        ? json_decode(file_get_contents($jsonFile), true)
        : [];

    $settings['logo_300_url'] = $url;

    file_put_contents($jsonFile, json_encode($settings, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'url' => $url]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to move uploaded file']);
}
