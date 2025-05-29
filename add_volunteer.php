<?php
// add_volunteer.php
header('Content-Type: application/json; charset=utf-8');
require 'db_connection.php';

$data  = json_decode(file_get_contents('php://input'), true);
$name  = trim($data['name']  ?? '');
$email = trim($data['email'] ?? '');
$phone = trim($data['phone'] ?? '');

if ($name === '' || $email === '') {
    http_response_code(400);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Поля name и email обязательны'
    ]);
    exit;
}

// Проверяем на дубликат по email
$stmt = $conn->prepare("SELECT id FROM volunteers WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode([
        'status'  => 'error',
        'message' => 'Волонтёр с таким email уже существует'
    ]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// Вставляем нового волонтёра
$stmt = $conn->prepare("INSERT INTO volunteers (name, email, phone) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $phone);

if ($stmt->execute()) {
    echo json_encode([
        'status'       => 'success',
        'message'      => 'Волонтёр успешно зарегистрирован',
        'volunteer_id' => $stmt->insert_id
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => $stmt->error
    ]);
}

$stmt->close();
$conn->close();
