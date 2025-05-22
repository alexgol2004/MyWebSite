// Получение всех мероприятий из API
async function fetchEvents() {
    const response = await fetch('https://your-api-url.com/api/events');
    const events = await response.json();
    const eventsContainer = document.getElementById('events');
    eventsContainer.innerHTML = '';
    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event';
        eventElement.innerHTML = `
            <strong>Название:</strong> ${event.name}<br>
            <strong>Описание:</strong> ${event.description}
            <div class="actions">
                <button onclick="registerForEvent(${event.id})">Зарегистрироваться</button>
            </div>
        `;
        eventsContainer.appendChild(eventElement);
    });
}

// Регистрация на мероприятие
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventId = document.getElementById('eventId').value;
    await fetch('https://your-api-url.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
    });
    document.getElementById('eventForm').reset();
    fetchEvents();
});

// Загрузка мероприятий при загрузке страницы
fetchEvents();
