<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'path/to/PHPMailer/src/Exception.php';
require 'path/to/PHPMailer/src/PHPMailer.php';
require 'path/to/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->SMTPDebug = 0;                                   // Disable verbose debug output
        $mail->isSMTP();                                        // Send using SMTP
        $mail->Host       = 'smtpout.secureserver.net';         // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                               // Enable SMTP authentication
        $mail->Username   = 'your-email@yourdomain.com';        // SMTP username
        $mail->Password   = 'your-email-password';              // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;     // Enable TLS encryption, `PHPMailer::ENCRYPTION_SMTPS` also accepted
        $mail->Port       = 587;                                // TCP port to connect to

        // Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress('your-email@yourdomain.com');         // Add a recipient

        // Content
        $mail->isHTML(false);                                   // Set email format to HTML
        $mail->Subject = 'Contact Form Submission';
        $mail->Body    = "Name: $name\nEmail: $email\n\nMessage:\n$message";

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request method.";
}
?>
