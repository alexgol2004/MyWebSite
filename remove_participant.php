<?php
header('Content-Type: application/json');
require 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$event_id     = (int)$data['event_id'];
$volunteer_id = (int)$data['volunteer_id'];

$sql = "DELETE FROM event_participants WHERE event_id = ? AND volunteer_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $event_id, $volunteer_id);
if ($stmt->execute()) {
    echo json_encode(["status"=>"success","message"=>"Unregistered successfully"]);
} else {
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
}
$stmt->close();
$conn->close();
