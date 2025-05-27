document.addEventListener('DOMContentLoaded', function() {
    const calendarDiv = document.getElementById('calendar');

    // Пример данных из базы данных
    const events = [
        {
            id: 1,
            title: 'Сбор средств',
            description: 'Сбор средств на благотворительность',
            event_date: '2023-12-25 10:00:00',
            location: 'Москва',
            max_participants: 50,
            organizer_id: 1
        }
    ];

    // Пример простого календаря
    const calendar = `
        <table>
            <thead>
                <tr>
                    <th>Пн</th>
                    <th>Вт</th>
                    <th>Ср</th>
                    <th>Чт</th>
                    <th>Пт</th>
                    <th>Сб</th>
                    <th>Вс</th>
                </tr>
            </thead>
            <tbody>
                <!-- Здесь будет динамически генерироваться календарь -->
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>25</td>
                    <td>26</td>
                </tr>
            </tbody>
        </table>
    `;

    calendarDiv.innerHTML = calendar;

    // Функция для отправки заявки на участие в мероприятии
    async function sendEventRegistration(eventId, volunteerId) {
        const botToken = '6739035007:AAEn_Y10WBZKstTIAGQVN5zuAhTc1z78tkw';
        const chatId = '4957042539';

        const message = `Заявка на участие в мероприятии с ID ${eventId} от волонтера с ID ${volunteerId}.`;

        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('Заявка на участие в мероприятии отправлена');
            } else {
                console.error('Ошибка при отправке заявки:', data.description);
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
        }
    }

    // Пример вызова функции для отправки заявки
    sendEventRegistration(1, 1);
});
