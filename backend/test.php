<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Autorise Electron à appeler le PHP

echo json_encode([
    "status" => "success",
    "message" => "Backend PHP opérationnel pour DocFlow",
    "php_version" => phpversion()
]);