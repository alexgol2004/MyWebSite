<?php
// get_organizers.php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/db_connection.php';

$sql = "SELECT id, name FROM organizers ORDER BY name";
$res = $conn->query($sql);
if (!$res) {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$conn->error]);
    exit;
}

$out = [];
while($r = $res->fetch_assoc()) {
    $out[] = $r;
}
echo json_encode($out);
$conn->close();
