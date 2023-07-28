<?php

$persons = json_decode($_POST["persons"]);

$from = "noreply@deeplace.md";
$to = "vladimir.plesco@gmail.com";
$title = "Напоминание о ДР";
$body = "<h2>Сегодня родились</h2>";

$body .= "<ul>";
foreach ($persons as $person) {
  $body .= "<li>" . $person->name . " (" . $person->birth . ")</li>";
}
$body .= "</ul>";

$headers = [
  "From" => $from,
  "Content-type" => "text/html"
];

mail($to, $title, $body, $headers);
