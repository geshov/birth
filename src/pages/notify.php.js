const php = `<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$csv = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vT_Aywj-d6NZ0rp5LZS66WR6-ex_HH9Fkp9xx9nhPwI1LGA1OwR2Mmg90dUUttFByBl91NoVDcYghqh/pub?gid=0&single=true&output=csv");

$rows = explode("\r\n", $csv);

$persons = array_map(function($row) {
  $fields = explode(",", $row);
  return (object) ["name" => $fields[0], "birth" => $fields[1]];
}, $rows);

// здесь нужно отфильтровать массив $persons, сравнивая ДР с текущей датой
// если сегодня никто не родился, то дальше ничего не далеть (exit)

$body = "<h2>Сегодня родились</h2>";
$body .= "<ul>";
foreach ($persons as $person) {
  $body .= "<li>" . $person->name . " (" . $person->birth . ")</li>";
}
$body .= "</ul>";

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = "smtp.gmail.com";
  $mail->SMTPAuth = true;
  $mail->Username = "geshov@gmail.com";
  $mail->SMTPSecure = "tls";
  $mail->Port = 587;
  $mail->CharSet = "UTF-8";
  $mail->Encoding = "base64"; 

  $mail->setFrom("geshov@gmail.com", "Alex");
  $mail->addAddress("geshov@gmail.com", "Alex");

  $mail->isHTML(true);
  $mail->Subject = "Напоминание о ДР";
  $mail->Body = $body;

  $mail->send();
  echo "Message has been sent";
} catch (Exception $e) {
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
`;

export function get() {
  return {
    body: php
  };
}
