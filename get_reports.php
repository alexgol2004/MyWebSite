<?php
header('Content-Type: application/json');
require 'db_connection.php';

$volunteer_id = isset($_GET['volunteer_id']) ? (int)$_GET['volunteer_id'] : 0;

$sql = "
  SELECT ar.id, ar.volunteer_id, v.name AS volunteer_name,
         ar.event_id, e.title AS event_title,
         ar.hours_spent, ar.tasks_completed, ar.report_date
  FROM activity_reports ar
  JOIN volunteers v ON ar.volunteer_id = v.id
  JOIN events e     ON ar.event_id     = e.id
  WHERE ar.volunteer_id = ?
  ORDER BY ar.report_date DESC
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $volunteer_id);
$stmt->execute();
$res = $stmt->get_result();
$reports = $res->fetch_all(MYSQLI_ASSOC);

echo json_encode($reports);

$stmt->close();
$conn->close();
