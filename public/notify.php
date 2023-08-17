<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require "PHPMailer/src/Exception.php";
require "PHPMailer/src/PHPMailer.php";
require "PHPMailer/src/SMTP.php";

require "credentials.php";

$csv = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vT_Aywj-d6NZ0rp5LZS66WR6-ex_HH9Fkp9xx9nhPwI1LGA1OwR2Mmg90dUUttFByBl91NoVDcYghqh/pub?gid=0&single=true&output=csv");

$rows = explode("\r\n", $csv);
$persons = array_map(function($row) {
  $fields = explode(",", $row);
  if (!strtotime($fields[1])) return false;
  $name = $fields[0];
  $birth = new DateTime($fields[1]);
  $addresses = array();
  for ($i = 2; $i < count($fields); $i++) {
    $email = filter_var($fields[$i], FILTER_VALIDATE_EMAIL);
    if ($email) $addresses[] = $email;
  }
  return (object) ["name" => $name, "birth" => $birth, "addresses" => $addresses];
}, $rows);

$now = new DateTime();
$borns = array_filter($persons, function($person) {
  if (!$person) return false;
  global $now;
  return $person->birth->format("n") == $now->format("n") && $person->birth->format("j") == $now->format("j");
});
if (empty($borns)) exit("Persons not found");

$idf = new IntlDateFormatter("ru_RU", IntlDateFormatter::LONG, IntlDateFormatter::NONE, "Europe/Moscow");

$subject = "Напоминание о ДР";
$body = "<h2>Сегодня родились</h2>";

$addresses = array();
$body .= "<ul>";
foreach ($borns as $born) {
  $body .= "<li>" . $born->name . " (" . $idf->format($born->birth) . ")</li>";
  $addresses = array_merge($addresses, $born->addresses);
}
$body .= "</ul>";
$addresses = array_unique($addresses);

$body .= '<div><a href="https://birth.geshov.ru/">Посмотреть весь список</a></div>';

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host = "smtp.gmail.com";
  $mail->SMTPAuth = true;
  $mail->Username = $from;
  $mail->Password = $password;
  $mail->SMTPSecure = "tls";
  $mail->Port = 587;
  $mail->CharSet = "UTF-8";
  $mail->Encoding = "base64"; 

  $mail->setFrom($from);
  $mail->addBCC($from);
  foreach($addresses as $address) {
    $mail->addAddress($address);
  }

  $mail->isHTML(true);
  $mail->Subject = $subject;
  $mail->Body = $body;

  $mail->send();
  echo "Message has been sent";
} catch (Exception $e) {
  echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
