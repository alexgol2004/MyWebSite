<?php
// add_organizer.php
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/db_connection.php';

$data  = json_decode(file_get_contents('php://input'), true);
$name  = trim($data['name']  ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode(['status'=>'error','message'=>'Поля name и email обязательны']);
    exit;
}

// проверяем дубликат
$stmt = $conn->prepare("SELECT id FROM organizers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows) {
    echo json_encode(['status'=>'error','message'=>'Организатор с таким email уже есть']);
    exit;
}
$stmt->close();

// вставляем
$stmt = $conn->prepare("INSERT INTO organizers (name, email, phone) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $phone);
if ($stmt->execute()) {
    echo json_encode([
      'status'       => 'success',
      'message'      => 'Организатор добавлен',
      'organizer_id' => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$stmt->error]);
}
$stmt->close();
$conn->close();
