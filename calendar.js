document.addEventListener('DOMContentLoaded', function() {
    const calendarDiv = document.getElementById('calendar');

    async function loadEvents() {
        try {
            const response = await fetch('get_events.php');
            const events = await response.json();
            
            // Используем FullCalendar или аналогичную библиотеку
            if (typeof FullCalendar !== 'undefined') {
                const calendarEl = document.getElementById('calendar');
                const calendar = new FullCalendar.Calendar(calendarEl, {
                    initialView: 'dayGridMonth',
                    events: events.map(event => ({
                        title: event.title,
                        start: event.event_date,
                        extendedProps: {
                            description: event.description,
                            location: event.location,
                            id: event.id
                        }
                    })),
                    eventClick: function(info) {
                        showEventDetails(info.event);
                    }
                });
                calendar.render();
            } else {
                // Простой календарь, если FullCalendar не подключен
                renderSimpleCalendar(events);
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }
    
    function renderSimpleCalendar(events) {
        let html = '<div class="events-list">';
        events.forEach(event => {
            html += `
                <div class="event-card" data-id="${event.id}">
                    <h3>${event.title}</h3>
                    <p>Дата: ${new Date(event.event_date).toLocaleString()}</p>
                    <p>Место: ${event.location}</p>
                    <button onclick="showEventDetails(${event.id})">Подробнее</button>
                </div>
            `;
        });
        html += '</div>';
        calendarDiv.innerHTML = html;
    }
    
    loadEvents();
});

function showEventDetails(eventId) {
    // Загружаем детали мероприятия и показываем модальное окно
    fetch(`get_event_details.php?id=${eventId}`)
        .then(response => response.json())
        .then(event => {
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>${event.title}</h2>
                    <p>${event.description}</p>
                    <p>Дата: ${new Date(event.event_date).toLocaleString()}</p>
                    <p>Место: ${event.location}</p>
                    <div id="event-volunteers"></div>
                    <button id="register-btn">Зарегистрироваться</button>
                    <div id="report-form" style="display:none;">
                        <h3>Отчет о мероприятии</h3>
                        <input type="number" id="hours-spent" placeholder="Часов потрачено">
                        <input type="number" id="tasks-completed" placeholder="Заданий выполнено">
                        <button id="submit-report">Отправить отчет</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Загружаем список волонтеров на мероприятие
            loadEventVolunteers(eventId);
            
            // Обработчики событий
            modal.querySelector('.close').addEventListener('click', () => modal.remove());
            modal.querySelector('#register-btn').addEventListener('click', () => registerToEvent(eventId));
            
            // Проверяем, участвует ли текущий пользователь в мероприятии
            checkParticipation(eventId, modal);
        });
}

function loadEventVolunteers(eventId) {
    fetch(`get_event_volunteers.php?event_id=${eventId}`)
        .then(response => response.json())
        .then(volunteers => {
            const container = document.getElementById('event-volunteers');
            container.innerHTML = '<h3>Участники:</h3><ul>' + 
                volunteers.map(v => `<li>${v.name} (${v.email})</li>`).join('') + 
                '</ul>';
        });
}

function registerToEvent(eventId) {
    // Здесь нужно получить ID текущего пользователя (например, из сессии)
    const volunteerId = 1; // Временное значение
    
    fetch('volunteer_management.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            action: 'register_to_event',
            event_id: eventId,
            volunteer_id: volunteerId
        })
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert('Вы успешно зарегистрировались на мероприятие!');
              location.reload();
          }
      });
}

function checkParticipation(eventId, modal) {
    const volunteerId = 1; // Временное значение
    
    fetch(`check_participation.php?event_id=${eventId}&volunteer_id=${volunteerId}`)
        .then(response => response.json())
        .then(data => {
            if (data.is_participating) {
                modal.querySelector('#register-btn').style.display = 'none';
                modal.querySelector('#report-form').style.display = 'block';
                
                modal.querySelector('#submit-report').addEventListener('click', () => {
                    submitReport(eventId, volunteerId);
                });
            }
        });
}

function submitReport(eventId, volunteerId) {
    const hoursSpent = document.getElementById('hours-spent').value;
    const tasksCompleted = document.getElementById('tasks-completed').value;
    
    fetch('activity_reports.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            volunteer_id: volunteerId,
            event_id: eventId,
            hours_spent: hoursSpent,
            tasks_completed: tasksCompleted
        })
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert('Отчет успешно отправлен!');
              document.querySelector('.modal').remove();
          }
      });
}