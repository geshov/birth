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

$now = new DateTime("now");
$idf = new IntlDateFormatter("ru_RU", IntlDateFormatter::LONG, IntlDateFormatter::NONE, "Europe/Moscow");

// здесь нужно отфильтровать массив $persons, сравнивая ДР с текущей датой
// если сегодня никто не родился, то дальше ничего не далеть (exit)

$subject = "Напоминание о ДР";

$body = "<h2>Сегодня родились</h2>";
$body .= "<ul>";
foreach ($persons as $person) {
  $body .= "<li>" . $person->name . " (" . $idf->format($person->birth) . ")</li>";
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
  $mail->addAddress("${import.meta.env.MAIL_FROM}");

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
