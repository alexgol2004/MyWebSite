<?php
header('Content-Type: application/json');
require 'db_connection.php';

$event_id = isset($_GET['event_id']) ? (int)$_GET['event_id'] : 0;

$sql = "
  SELECT ep.volunteer_id, v.name, v.email, ep.registration_date
  FROM event_participants ep
  JOIN volunteers v ON ep.volunteer_id = v.id
  WHERE ep.event_id = ?
  ORDER BY ep.registration_date DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $event_id);
$stmt->execute();
$res = $stmt->get_result();
$participants = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($participants);

$stmt->close();
$conn->close();
