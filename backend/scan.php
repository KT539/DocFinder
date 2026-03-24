<?php
header('Content-Type: application/json'); // informs the client that the following data will be in JSON
header('Access-Control-Allow-Origin: http://localhost:5173'); // allows this port to bypass the browser's CORS policy ; !! help from AI !!

// $_GET['path'] : access the value of the path parameter provided in the URL
$path = $_GET['path'] ?? ''; // null coalescing operator : if the path parameter is null/not set, then use an empty string instead ; !! help from AI !!

if (empty($path)) {
    echo json_encode(['error' => 'No path provided']); // echo sends back string data ; json_encode makes it into valid JSON
    exit;
}

if (!is_dir($path)) { // checks in the file system if the folder provided exists
    echo json_encode(['error' => 'Invalid directory path']);
    exit;
}

if (!is_readable($path)) { // checks if user has the permission to read the provided folder
    echo json_encode(['error' => 'You do not have permission to read this directory.']);
    exit;
}

$files = scandir($path); // use scandir function to return the content of the folder as a table
$pdfs = [];

// get the full path of each file
foreach ($files as $file) { 
    $fullPath = $path . DIRECTORY_SEPARATOR . $file; // DIRECTORY_SEPARATOR = a PHP const that equals \ on Windows and / on Linux/macOS
    if (is_file($fullPath) && strtoLower(pathinfo($file, PATHINFO_EXTENSION)) === 'pdf') { // checks that the file is a file and not a folder, and that the extension is .pdf ; !! help from AI !!
        $pdfs[] = [
            'name' => $file,
            'path' => $fullPath
        ];
    }
}

$type = $_GET['type'] ?? 'pdf'; // get the value of the type parameter in the URL, or pdf as default value


echo json_encode([
    'success' => true,
    'pdfs' => $type === 'pdf' ? $pdfs : [], // if type = pdf return the pdfs table, else an empty table (ternary operator)
]);