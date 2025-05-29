<?php
header('Content-Type: application/json; charset=utf-8');

// ваши настройки
$apiToken = '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';
$baseUrl  = 'https://openrouter.ai/chat?models=deepseek/deepseek-r1-0528:free';

// читаем входные данные
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

// если передали request_id — опрашиваем статус
if (!empty($data['request_id'])) {
    $requestId = $data['request_id'];
    $url = "$baseUrl/requests/$requestId";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiToken
        ],
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
    ]);
    $resp = curl_exec($ch);
    $err  = curl_error($ch);
    $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if($err){
        http_response_code(500);
        echo json_encode(['error' => $err]);
        exit;
    }
    $json = json_decode($resp, true);

    // если всё ещё processing — возвращаем статус
    if (isset($json['status']) && $json['status'] === 'processing') {
        http_response_code(202);
        echo json_encode([
            'status'     => 'processing',
            'request_id' => $requestId
        ]);
        exit;
    }

    // иначе — выдаём готовый ответ
    if (isset($json['choices'][0]['message']['content'])) {
        echo json_encode(['reply' => $json['choices'][0]['message']['content']]);
        exit;
    }

    // нечто неожиданное
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected status response', 'details' => $json]);
    exit;
}

// иначе — это новый чат
$userMessage = trim($data['message'] ?? '');
if ($userMessage === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Empty message']);
    exit;
}

$payload = [
    "messages" => [
        ["role" => "user", "content" => $userMessage]
    ]
];

$ch = curl_init("$baseUrl/deepseek/deepseek-r1-0528:free");
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiToken
    ],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);
$response = curl_exec($ch);
$err      = curl_error($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => $err]);
    exit;
}

$json = json_decode($response, true);
if ($httpCode === 200 && isset($json['choices'][0]['message']['content'])) {
    // сразу готовый ответ
    echo json_encode(['reply' => $json['choices'][0]['message']['content']]);
    exit;
}

// если пришёл processing
if (isset($json['status']) && $json['status'] === 'processing') {
    http_response_code(202);
    echo json_encode([
        'status'     => 'processing',
        'request_id' => $json['request_id']
    ]);
    exit;
}

// всё остальное — ошибка
http_response_code(500);
echo json_encode(['error'=>'Unexpected response','details'=>$json]);
exit;
