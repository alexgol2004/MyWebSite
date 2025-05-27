document.addEventListener('DOMContentLoaded', function() {
    const statisticsDiv = document.getElementById('statistics');

    // Пример данных из базы данных
    const statistics = `
        <p>Всего часов волонтерства: 120</p>
        <p>Участие в мероприятиях: 15</p>
        <p>Средняя оценка: 4.8</p>
    `;

    statisticsDiv.innerHTML = statistics;
});
