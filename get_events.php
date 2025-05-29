<?php
require 'db_connection.php'; // в нём уже назначен header JSON

$sql    = "SELECT id, title, description, event_date, location, max_participants, organizer_id
           FROM events
           ORDER BY event_date ASC";
$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$conn->error]);
    exit;
}

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
$conn->close();
