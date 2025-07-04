<?php
$docRoot = $_SERVER['DOCUMENT_ROOT'];
require_once $docRoot . '/config/db.php';
require_once $docRoot . '/vendor/autoload.php'; // PHPMailer

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

allowOnlyAdmins('admin, manager, staff');

// Ensure session
if (! isset($_SESSION['user']['UserID'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$userId = $_SESSION['user']['UserID'];
$data   = json_decode(file_get_contents("php://input"), true);

if (! isset($data['enable_2fa'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$isEnabled = $data['enable_2fa'] ? 1 : 0;

// Only test mail if enabling 2FA
if ($isEnabled) {
    $settingsJson = @file_get_contents("https://spidywarehouse.unaux.co/api/v1/settings/general.php");
    $settings     = json_decode($settingsJson, true);

    if (! $settings || ! isset($settings['smtp_host'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Unable to load mail settings from API',
        ]);
        exit;
    }

    // Extract SMTP settings
    $smtpHost = $settings['smtp_host'];
    $smtpPort = (int) $settings['smtp_port'];
    $smtpUser = $settings['smtp_user'];
    $smtpPass = $settings['smtp_pass'];
    $domain   = parse_url($settings['api_url'], PHP_URL_HOST); // Extract just the host from the URL

    // Sanitize secure setting
    $smtpSecure = strtolower(trim($settings['smtp_secure']));
    if (! in_array($smtpSecure, ['tls', 'ssl'])) {
        $smtpSecure = false;
    }

    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host        = $smtpHost;
        $mail->Port        = $smtpPort;
        $mail->SMTPAuth    = true;
        $mail->Username    = $smtpUser;
        $mail->Password    = $smtpPass;
        $mail->SMTPSecure  = $smtpSecure;
        $mail->SMTPAutoTLS = false;

        // Dummy message to validate connection

        $mail->setFrom('noreply@' . $domain, 'Spidy House');
        $mail->addAddress('test@' . $domain);
        $mail->Subject = '2FA SMTP Check';
        $mail->Body    = 'Checking SMTP connection before enabling 2FA';

        $mail->preSend(); // Only validates the connection and message, doesn't send
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => '2FA could not be enabled: mail setup is not working.',
            'error'   => $mail->ErrorInfo,
        ]);
        exit;
    }
}

// Save 2FA setting in DB
$stmt = $conn->prepare("UPDATE users SET is_2fa_enabled = ? WHERE UserID = ?");
$stmt->bind_param("ii", $isEnabled, $userId);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update 2FA']);
}

$stmt->close();
$conn->close();
