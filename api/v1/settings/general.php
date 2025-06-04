<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

$jsonFile = __DIR__ . '/site-settings.json';
$envFile = $docRoot . '/.env';

// Load Dotenv
require_once $docRoot . '/vendor/autoload.php';
use Dotenv\Dotenv;

if (!file_exists($envFile)) {
    file_put_contents($envFile, '');
}

$dotenv = Dotenv::createImmutable($docRoot);
$dotenv->safeLoad();

function updateEnvFile($updates, $envPath) {
    // Load current environment variables
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];

    foreach ($lines as $line) {
        if (strpos(trim($line), '=') !== false && strpos(trim($line), '#') !== 0) {
            list($key, $val) = explode('=', $line, 2);
            $env[trim($key)] = trim($val, " \t\n\r\0\x0B\"");
        }
    }

    // Apply updates (override or add)
    foreach ($updates as $key => $val) {
        $env[strtoupper($key)] = trim($val, " \t\n\r\0\x0B\"");
    }

    // Rebuild .env content
    $content = '';
    foreach ($env as $k => $v) {
        $content .= $k . '="' . $v . '"' . "\n";
    }

    file_put_contents($envPath, $content);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo file_exists($jsonFile) ? file_get_contents($jsonFile) : json_encode([
        "api_url" => "",
        "environment" => "development"
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    allowOnlyAdmins('super_admin');

    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() === JSON_ERROR_NONE) {
        // Save to JSON
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT));

        // Update .env using Dotenv-safe logic
        updateEnvFile($data, $envFile);

        echo json_encode(["success" => true, "message" => "Settings saved and .env updated"]);
        logUserActivity($conn, "Settings", "Modified settings");
    } else {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    }
}
