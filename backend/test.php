<?php
header('Content-Type: application/json'); // informs the client that the following data will be in JSON
header('Access-Control-Allow-Origin: *'); // authorize any web page to send requests to this server without triggering a block from the browser's CORS policies

// json_encode encodes the associative table into valid JSON
// echo is a PHP instruction to send back string data to the client
echo json_encode([
    "status" => "success",
    "message" => "Backend PHP opérationnel pour DocFlow",
    "php_version" => phpversion()
]);