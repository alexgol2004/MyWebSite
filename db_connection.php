<?php
// db_connection.php
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Включаем перехват «фатальных» ошибок
register_shutdown_function(function(){
    $err = error_get_last();
    if($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])){
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'status'  => 'error',
            'message' => $err['message']
        ]);
    }
});

// Перехват всех предупреждений/notice и их вывод в JSON
set_error_handler(function($errno, $errstr, $errfile, $errline){
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'status'  => 'error',
        'message' => "$errstr in $errfile:$errline"
    ]);
    exit;
});

header('Content-Type: application/json; charset=utf-8');

$servername = "localhost";
$username   = "root";
$password   = "password";
$dbname     = "volunteer_db";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => "Connection failed: " . $conn->connect_error
    ]);
    exit;
}
$conn->set_charset("utf8mb4");
