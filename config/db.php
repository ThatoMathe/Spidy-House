<?php
ini_set('display_errors', 1); // Prevent errors from being sent as HTML
error_reporting(E_ALL);

// Allow CORS from specific origin
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/vendor/autoload.php'; // Make sure composer autoload is included
require_once $docRoot . '/config/functions.php';
require_once $docRoot . '/config/session-utils.php';

// Load .env file
use Dotenv\Dotenv;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


$envFilePath = $docRoot . '/.env';

// Check if the .env file exists
if (!file_exists($envFilePath)) {
    // Create an empty .env file
    file_put_contents($envFilePath, '');
}

$dotenv = Dotenv::createImmutable($docRoot);
$dotenv->safeLoad();

// Get allowed origin from environment
$allowed_origin = $_ENV['BASE_URL'] ?? ''; 

if (in_array($_SERVER['REQUEST_METHOD'], ['OPTIONS', 'POST', 'GET', 'DELETE'])) {
    // check the session
    if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
        header("Access-Control-Allow-Origin: $allowed_origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
    }
}

// Handle preflight (OPTIONS) request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

// Connect to MySQL database
// Get credentials from .env
$servername = $_ENV['DB_HOST'] ?? 'localhost';
$username = $_ENV['DB_USER'] ?? 'root';
$password = $_ENV['DB_PASS'] ?? '';
$dbname   = $_ENV['DB_NAME'] ?? 'spidy_house';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

header('Content-Type: application/json');

