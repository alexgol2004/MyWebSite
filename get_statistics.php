<?php
header('Content-Type: application/json');
require 'db_connection.php';

$volunteer_id = isset($_GET['volunteer_id']) ? (int)$_GET['volunteer_id'] : 0;

// Всего часов и задач
$sql = "
  SELECT 
    COALESCE(SUM(ar.hours_spent),0)     AS total_hours,
    COALESCE(SUM(ar.tasks_completed),0) AS total_tasks,
    (SELECT COUNT(*) FROM event_participants WHERE volunteer_id = ?) AS events_participated
  FROM activity_reports ar
  WHERE ar.volunteer_id = ?
";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $volunteer_id, $volunteer_id);
$stmt->execute();
$res = $stmt->get_result();
$stats = $res->fetch_assoc() ?: [
  "total_hours"=>0, "total_tasks"=>0, "events_participated"=>0
];

echo json_encode($stats);

$stmt->close();
$conn->close();
