const php = `<?php

use PHPMailer\\PHPMailer\\PHPMailer;
use PHPMailer\\PHPMailer\\SMTP;
use PHPMailer\\PHPMailer\\Exception;

require "PHPMailer/src/Exception.php";
require "PHPMailer/src/PHPMailer.php";
require "PHPMailer/src/SMTP.php";

$csv = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vT_Aywj-d6NZ0rp5LZS66WR6-ex_HH9Fkp9xx9nhPwI1LGA1OwR2Mmg90dUUttFByBl91NoVDcYghqh/pub?gid=0&single=true&output=csv");

$rows = explode("\\r\\n", $csv);

$persons = array_map(function($row) {
  $fields = explode(",", $row);
  $name = $fields[0];
  $birth = new DateTime($fields[1]);
  return (object) ["name" => $name, "birth" => $birth];
}, $rows);

$now = new DateTime();
$borns = array_filter($persons, function($person) {
  global $now;
  return $person->birth->format("n") == $now->format("n") && $person->birth->format("j") == $now->format("j");
});
// if (empty($borns)) exit("Persons not found");

$idf = new IntlDateFormatter("ru_RU", IntlDateFormatter::LONG, IntlDateFormatter::NONE, "Europe/Moscow");

$subject = "Напоминание о ДР";
$body = "<h2>Сегодня родились</h2>";

$body .= "<ul>";
foreach ($borns as $born) {
  $body .= "<li>" . $born->name . " (" . $idf->format($born->birth) . ")</li>";
}
$body .= "</ul>";

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = "smtp.gmail.com";
  $mail->SMTPAuth = true;
  $mail->Username = "${import.meta.env.MAIL_FROM}";
  $mail->Password = "${import.meta.env.MAIL_PASSWORD}";
  $mail->SMTPSecure = "tls";
  $mail->Port = 587;
  $mail->CharSet = "UTF-8";
  $mail->Encoding = "base64"; 

  $mail->setFrom("${import.meta.env.MAIL_FROM}");
  $mail->addAddress("${import.meta.env.MAIL_ADDRESS1}");
  $mail->addAddress("${import.meta.env.MAIL_ADDRESS2}");

  $mail->isHTML(true);
  $mail->Subject = $subject;
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
