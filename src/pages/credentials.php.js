const php = `<?php

$password = "${import.meta.env.MAIL_PASSWORD}";
$from = "${import.meta.env.MAIL_FROM}";

$addresses = [
  "${import.meta.env.MAIL_ADDRESS1}",
  "${import.meta.env.MAIL_ADDRESS2}",
  "${import.meta.env.MAIL_ADDRESS3}",
  "${import.meta.env.MAIL_ADDRESS4}"
];
`;

export function get() {
  return {
    body: php
  };
}
