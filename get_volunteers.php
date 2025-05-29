<?php
// get_volunteers.php
header('Content-Type: application/json; charset=utf-8');
require 'db_connection.php';

$sql    = "SELECT id, name FROM volunteers ORDER BY name ASC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => $conn->error
    ]);
    exit;
}

$vols = [];
while ($row = $result->fetch_assoc()) {
    $vols[] = $row;
}

echo json_encode($vols);
$conn->close();
