<?php
// Include database
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Check if user is logged in
if (isset($_SESSION['user']['Email'])) {
    $email = $_SESSION['user']['Email'];

    // Set is_2fa_verified = 0
    $stmt = $conn->prepare("UPDATE users SET is_2fa_verified = 0 WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
}

// Clear all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Remove session cookie if set
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

// Return JSON response
echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully'
]);
