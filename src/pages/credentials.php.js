const php = `<?php

$from = "${import.meta.env.MAIL_FROM}";
$password = "${import.meta.env.MAIL_PASSWORD}";
`;

export function get() {
  return {
    body: php
  };
}
