<?php
    require_once $_SERVER['DOCUMENT_ROOT'] . '/vendor/autoload.php';

    use PHPMailer\PHPMailer\Exception;
    use PHPMailer\PHPMailer\PHPMailer;

    function allowOnlyAdmins($allowedRolesString)
    {
        // Get the user role from session
        $userRole = $_SESSION['user']['Role'] ?? null;

        // If no role found in session, deny access
        if (! $userRole) {
            http_response_code(403);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Access denied: No role found.',
            ]);
            exit;
        }

        // Convert string to array
        $allowedRoles = array_map('trim', explode(',', $allowedRolesString));

        // If role not listed, deny
        if (! in_array($userRole, $allowedRoles)) {
            http_response_code(403);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Access denied: You do not have permission.',
            ]);
            exit;
        }
    }

    function sendTwoFactorCode($conn, $email)
    {
        // Validate input
        if (! $email) {
            echo json_encode(['success' => false, 'message' => 'Email is required']);
            exit;
        }

        // Mark as unverified
        $update = $conn->prepare("UPDATE users SET is_2fa_verified = 0 WHERE Email = ?");
        $update->bind_param("s", $email);
        $update->execute();

        // Generate code if not provided
        $code = rand(100000, 999999);

        // Check if user exists
        $stmt = $conn->prepare("SELECT UserID FROM users WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user   = $result->fetch_assoc();

        if (! $user) {
            echo json_encode(['success' => false, 'message' => 'User not found']);
            exit;
        }

        // Update code in DB
        $update = $conn->prepare("UPDATE users SET two_fa_code = ? WHERE Email = ?");
        $update->bind_param("ss", $code, $email);
        $update->execute();

        // Send email
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['SMTP_HOST'];
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['SMTP_USER'];
            $mail->Password   = $_ENV['SMTP_PASS'];
            $mail->SMTPSecure = $_ENV['SMTP_SECURE']; // 'tls' or 'ssl'
            $mail->Port       = $_ENV['SMTP_PORT'];

            $mail->setFrom($_ENV['REACT_APP_SUPPORT_EMAIL'], $_ENV['SITE_NAME']);
            $mail->addAddress($email);
            $mail->isHTML(true);
            $mail->Subject = 'Your 2FA Verification Code';
            $mail->Body    = "<p>Your verification code is: <strong>$code</strong></p>";

            $mail->send();

            // echo json_encode(['success' => true, 'message' => 'Verification code sent']);
        } catch (Exception $e) {
            // echo json_encode(['success' => false, 'message' => 'Email failed: ' . $mail->ErrorInfo]);
        }
    }

    function logUserActivity($conn, $title, $description, $id = null)
    {
        if (! isset($_SESSION['user']['UserID'])) {
            error_log("UserID not found in session.");
            return false;
        }

        $userID = $_SESSION['user']['UserID'];

        $stmt = $conn->prepare("INSERT INTO useractivity (UserID, CreatedAt, Title, Description) VALUES (?, NOW(), ?, ?)");
        if (! $stmt) {
            return false;
        }

        $stmt->bind_param("iss", $userID, $title, $description);

        if ($stmt->execute()) {
            // Extract first number from description to use as activity reference
            if ($id) {
                logActivityNotification($conn, $title, $id);
            }

            return true;
        } else {
            return false;
        }
    }

    function logActivityNotification($conn, $title, $act_id)
    {
        if (! isset($_SESSION['user']['UserID'])) {
            error_log("UserID not found in session.");
            return false;
        }

        $userID = $_SESSION['user']['UserID'];

        $stmt    = $conn->prepare("INSERT INTO notifications (title, user_id, act_id) VALUES (?, ?, ?)");
        $stmt->bind_param("sii", $title, $userID, $act_id);
        $stmt->execute();
        $stmt->close();
    }
