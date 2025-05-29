<?php
header('Content-Type: application/json');
require 'db_connection.php';

$data = json_decode(file_get_contents('php://input'), true);
$vid = (int)$data['volunteer_id'];
$eid = (int)$data['event_id'];
$hrs = (int)$data['hours_spent'];
$tsk = (int)$data['tasks_completed'];

$stmt = $conn->prepare(
  "INSERT INTO activity_reports (volunteer_id, event_id, hours_spent, tasks_completed)
   VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("iiii", $vid, $eid, $hrs, $tsk);
if ($stmt->execute()) {
  echo json_encode(["status"=>"success","message"=>"Report added"]);
} else {
  // если foreign key ошибка – скажем пользователю, что надо сначала зарегистрировать волонтёра
  if ($conn->errno === 1452) {
    echo json_encode(["status"=>"error","message"=>"Неверный volunteer_id или event_id. Сначала зарегистрируйтесь в системе."]);
  } else {
    echo json_encode(["status"=>"error","message"=>$stmt->error]);
  }
}
$stmt->close();
$conn->close();
