<?php
$method = $_SERVER['REQUEST_METHOD'];

$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

// Handle preflight request
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$email || !$password) {
        echo json_encode(['loggedIn' => false, 'error' => 'Missing credentials']);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM users WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();


    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();


        if (password_verify($password, $user['Password'])) {
            unset($user['Password']);
            $_SESSION['user'] = $user;
            $_SESSION['user']['session_id'] = session_id();
            
            if ($user['is_2fa_enabled'] == 1) {
                sendTwoFactorCode($conn, $email);
            }

            echo json_encode([
                'loggedIn' => true,
                'user' => $user,
                'redirectTo' => '/dashboard'
            ]);

            if (isset($_SESSION['user']['UserID'])) {
                saveOrUpdateSession($conn, $_SESSION['user']['UserID']);
                logUserActivity($conn, "Users", "Logged in user [{$_SESSION['user']['UserID']}] [{$_SESSION['user']['UserName']}]", $_SESSION['user']['UserID']);
            }
        } else {
            echo json_encode(['loggedIn' => false, 'error' => 'Incorrect password']);
        }
    } else {
        echo json_encode(['loggedIn' => false, 'error' => 'User not found']);
    }
} elseif ($method === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode([
            'loggedIn' => true,
            'user' => $_SESSION['user']
        ]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
