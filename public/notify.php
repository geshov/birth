<?php

$csv = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vT_Aywj-d6NZ0rp5LZS66WR6-ex_HH9Fkp9xx9nhPwI1LGA1OwR2Mmg90dUUttFByBl91NoVDcYghqh/pub?gid=0&single=true&output=csv");

$rows = explode("\r\n", $csv);

$persons = array_map(function($row) {
  $fields = explode(",", $row);
  return (object) ["name" => $fields[0], "birth" => $fields[1]];
}, $rows);

// здесь нужно отфильтровать массив $persons, сравнивая ДР с текущей датой
// если сегодня никто не родился, то дальше ничего не далеть (exit)

$from = "noreply@geshov.ru";
$to = "geshov@gmail.com";
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
