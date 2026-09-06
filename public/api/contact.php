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
    
    $email_content = "You have received a new enquiry from your website.\n\n";
    $email_content .= "Name: $name\n";
    $email_content .= "Phone: $phone\n";
    $email_content .= "Service Required: $service\n\n";
    $email_content .= "Additional Details:\n$message\n";

    $email_headers = "From: noreply@gvmodernsurveyors.in";

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
