<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $phone = strip_tags(trim($_POST["phone"]));
    $service = isset($_POST["service"]) ? strip_tags(trim($_POST["service"])) : 'Not specified';
    $message = trim($_POST["message"]);

    if (empty($name) || empty($phone)) {
        http_response_code(400);
        echo json_encode(["message" => "Please fill all required fields."]);
        exit;
    }

    $recipient = "gvmodernsurveyors2022@gmail.com";
    $subject = "New Website Enquiry from $name";
    
    $email_content = "
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto; border-top: 4px solid #f5c500; }
        h2 { color: #333333; margin-top: 0; }
        p { color: #555555; font-size: 16px; line-height: 1.6; }
        .details { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; border: 1px solid #eeeeee; }
        .details strong { color: #222222; display: inline-block; width: 120px; }
        .footer { text-align: center; margin-top: 30px; font-size: 13px; color: #aaaaaa; }
      </style>
    </head>
    <body>
      <div class='container'>
        <h2>New Client Enquiry! 🎉</h2>
        <p>You have received a new enquiry from the GV Modern Surveyors website.</p>
        <div class='details'>
          <p><strong>Name:</strong> $name</p>
          <p><strong>Phone:</strong> <a href='tel:$phone'>$phone</a></p>
          <p><strong>Service:</strong> $service</p>
          <p><strong>Message:</strong><br/>" . nl2br($message) . "</p>
        </div>
        <div class='footer'>
          This email was sent automatically from your website form.
        </div>
      </div>
    </body>
    </html>
    ";

    $email_headers = "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-type: text/html; charset=utf-8\r\n";
    $email_headers .= "From: GV Modern Surveyors <noreply@gvmodernsurveyors.in>\r\n";
    $email_headers .= "Reply-To: $name <no-reply@gvmodernsurveyors.in>\r\n";

    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["message" => "Thank you! Your message has been sent."]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Oops! Something went wrong and we couldn't send your message."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["message" => "There was a problem with your submission, please try again."]);
}
?>
