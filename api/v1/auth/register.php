<?php

$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
    $username = trim($input['username'] ?? ''); // Optional: could be added in frontend later
    $role = trim($input['role'] ?? 'viewer'); // Default role
    $warehouseID = 1; // Set or get from input if needed

    if (empty($email) || empty($password)) {
        echo json_encode(['loggedIn' => false, 'error' => 'Email and password are required']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['loggedIn' => false, 'error' => 'Invalid email format']);
        exit;
    }

    // Check if user already exists
    $checkStmt = $conn->prepare("SELECT UserID FROM users WHERE Email = ?");
    $checkStmt->bind_param("s", $email);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult && $checkResult->num_rows > 0) {
        echo json_encode(['loggedIn' => false, 'error' => 'Email already registered']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO users (UserName, Email, Password, Role, WarehouseID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $username, $email, $hashedPassword, $role, $warehouseID);

    if ($stmt->execute()) {
        $userID = $stmt->insert_id;

        // Fetch inserted user data
        $user = [
            'UserID' => $userID,
            'UserName' => $username,
            'Email' => $email,
            'Role' => $role,
            'WarehouseID' => $warehouseID,
            'CreatedDate' => date('Y-m-d H:i:s')
        ];

        $_SESSION['user'] = $user;

        echo json_encode([
            'loggedIn' => true,
            'user' => $user
        ]);
        logUserActivity($conn, "Users", "New registered user [$userID] [$username]", $userID);
    } else {
        echo json_encode(['loggedIn' => false, 'error' => 'Registration failed']);
    }

} elseif ($method === 'GET') {
    if (isset($_SESSION['user'])) {
        echo json_encode(['loggedIn' => true, 'user' => $_SESSION['user']]);
    } else {
        echo json_encode(['loggedIn' => false]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
