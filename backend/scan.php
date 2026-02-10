<?php
header('Content-Type: application/json'); // informs the client that the following data will be in JSON
header('Access-Control-Allow-Origin: *'); // authorize any web page to send requests to this server without triggering a block from the browser's CORS policies

// $_GET['path'] : access the value of the path parameter provided in the URL
$path = $_GET['path'] ?? ''; // null coalescing operator : if the path parameter is null, then use an empty string instead

if (empty($path)) { // returns true if path is empty
    echo json_encode(['error' => 'No path provided']); // echo sends back string data ; json_encode makes it into valid JSON
    exit;
}

if (!is_dir($path)) { // checks in the file system if the folder provided exists
    echo json_encode(['error' => 'Invalid directory path']);
    exit;
}

$files = scandir($path); // use scandir function to return the content of the folder as a table
$pdfs = [];

foreach ($files as $file) {
    $fullPath = $path . DIRECTORY_SEPARATOR . $file; // DIRECTORY_SEPARATOR = a PHP const that equals \ on Windows and / on Linux/macOS
    if (is_file($fullPath) && pathinfo($file, PATHINFO_EXTENSION) === 'pdf') { // checks that the file is a file and not a folder, and that the extension is .pdf
        $pdfs[] = [
            'name' => $file,
            'path' => $fullPath
        ];
    }
}

// returns a JSON object as a response to the ipcRenderer, with operation status and PDFs list
echo json_encode([
    'success' => true,
    'pdfs' => $pdfs
]);

/* full app data flow for reference :
React calls window.electronAPI.scanPdfs(path) -->
preload.js (ipcRenderer) relays it through IPC with invoke() --> 
main.js (ipcMain) receives the call via handle() and makes an HTTP request with fetch() --> 
the PHP server receives the HTTP GET request, processes the path, and sends an HTTP response with echo json_encode() --> 
main.js receives the HTTP response, parses it with .json(), and returns the data --> 
the return automatically sends the data back through IPC (with invoke/handle) -->
React receives the response when the promise resolves */