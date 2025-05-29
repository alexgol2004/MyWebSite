<?php
// chatbot_api.php
header('Content-Type: application/json; charset=utf-8');
$data = json_decode(file_get_contents('php://input'), true);
$msg  = trim($data['message'] ?? '');
$reply = $msg
  ? "Бот получил ваше сообщение: «{$msg}»"
  : "Напишите что-нибудь.";
echo json_encode(['reply' => $reply]);
