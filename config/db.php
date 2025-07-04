<?php
// Disable error display in production
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Define document root
$docRoot = $_SERVER['DOCUMENT_ROOT'];

// Composer & core includes
require_once $docRoot . '/vendor/autoload.php';
require_once $docRoot . '/config/functions.php';
require_once $docRoot . '/config/session-utils.php';

use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load .env securely
$envFilePath = $docRoot . '/.env';
if (!file_exists($envFilePath)) {
    file_put_contents($envFilePath, ''); // Create an empty .env file if missing
}
$dotenv = Dotenv::createImmutable($docRoot);
$dotenv->safeLoad();

// Set secure headers
header('Content-Type: application/json');

// CORS
$allowed_origin = $_ENV['BASE_URL'] ?? '';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($_SERVER['REQUEST_METHOD'], ['OPTIONS', 'POST', 'GET', 'DELETE'])) {
    if (!empty($allowed_origin) && $origin === $allowed_origin) {
        header("Access-Control-Allow-Origin: $allowed_origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
    } else {
        http_response_code(403);
        echo json_encode(["error" => "CORS origin not allowed"]);
        exit();
    }
}

// Handle OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Start session safely
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Connect to DB using environment variables
$servername = $_ENV['DB_HOST'] ?? 'localhost';
$username   = $_ENV['DB_USER'] ?? 'root';
$password   = $_ENV['DB_PASS'] ?? '';
$dbname     = $_ENV['DB_NAME'] ?? 'spidy_house';

// Secure DB connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    error_log("Database connection error: " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}
?>
