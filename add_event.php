<?php
// add_event.php — всегда возвращает JSON и показывает любые ошибки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db_connection.php';

// Разбираем сырой JSON из тела запроса
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

// Валидация обязательных полей
if (empty($data['title']) || empty($data['event_date'])) {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'stage'   => 'validation',
        'message' => 'Поля title и event_date обязательны',
        'received'=> $data
    ]);
    exit;
}

// Подготовка параметров
$title  = $data['title'];
$desc   = $data['description']      ?? '';
$date   = $data['event_date'];
$loc    = $data['location']         ?? '';
$max    = isset($data['max_participants']) 
             ? (int)$data['max_participants'] 
             : null;
$org    = isset($data['organizer_id']) 
             ? (int)$data['organizer_id'] 
             : null;

// Готовим и выполняем запрос
$sql = "INSERT INTO events
          (title, description, event_date, location, max_participants, organizer_id)
        VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['status'=>'error','stage'=>'prepare','message'=>$conn->error]);
    exit;
}
$stmt->bind_param("ssssii", $title, $desc, $date, $loc, $max, $org);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['status'=>'error','stage'=>'execute','message'=>$stmt->error]);
    exit;
}

// Успешный ответ
echo json_encode([
    'status'   => 'success',
    'message'  => 'Событие добавлено',
    'event_id' => $stmt->insert_id
]);

$stmt->close();
$conn->close();
exit;
