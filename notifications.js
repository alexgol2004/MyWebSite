document.addEventListener('DOMContentLoaded', function() {
    const notificationsDiv = document.getElementById('notifications');

    // Пример данных из базы данных
    const notifications = [
        { id: 1, text: 'Новое мероприятие: Сбор средств на благотворительность' },
        { id: 2, text: 'Напоминание: Встреча с командой в 14:00' }
    ];

    notificationsDiv.innerHTML = notifications.map(notification => `
        <div class="notification">
            <p>${notification.text}</p>
        </div>
    `).join('');

    // Функция для обновления уведомлений
    function updateNotifications(eventData) {
        const notificationElement = document.createElement('div');
        notificationElement.textContent = `Новое мероприятие: ${eventData.title}, Дата: ${eventData.event_date}`;
        notificationsDiv.appendChild(notificationElement);
    }
});
