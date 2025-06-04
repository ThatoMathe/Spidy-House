<?php
function getClientIP() {
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function getUserAgent() {
    return $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
}


function saveOrUpdateSession($conn, $userId) {
    $ip = getClientIP();
    $userAgent = getUserAgent();
    $token = session_id();
    $now = date('Y-m-d H:i:s');

    // Save token in session if not already
    if (!isset($_SESSION['session_token'])) {
        $_SESSION['session_token'] = $token;
    }

    // Check if session already exists
    $checkSql = "SELECT SessionID FROM session WHERE UserID = ? AND Token = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("is", $userId, $token);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();

    if ($checkResult->num_rows > 0) {
        // Session exists → update ResentDate
        $row = $checkResult->fetch_assoc();
        $updateSql = "UPDATE session SET ResentDate = ?, IPAddress = ?, UserAgent = ? WHERE SessionID = ?";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bind_param("sssi", $now, $ip, $userAgent, $row['SessionID']);
        $updateStmt->execute();
        $updateStmt->close();
    } else {
        // New session → insert
        $insertSql = "INSERT INTO session (UserID, IPAddress, Token, UserAgent, CreatedAt) VALUES (?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("issss", $userId, $ip, $token, $userAgent, $now);
        $insertStmt->execute();
        $insertStmt->close();
    }

    $checkStmt->close();
}
