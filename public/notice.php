<?php

$persons = [];

$csv = file_get_contents("https://docs.google.com/spreadsheets/d/e/2PACX-1vT-5j3rZHVbVl3fdH6Up-V_eRkb35Qb6Hev1cY0FQgi6RKGrinIiJdDkBno-XxPHMpKO_3MK6Npwakb/pub?gid=0&single=true&output=csv");

$lines = explode("\r\n", $csv);

foreach ($lines as $line) {
  $fields = explode(",", $line);
  $persons[] = (object) ["name" => $fields[0], "birth" => $fields[1]];
}

// здесь нужно отфильтровать массив $persons по совпадению ДР с текущей датой
// если сегодня никто не родился, то дальше ничего не далеть (exit)

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
