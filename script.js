// js/script.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('eventCreationForm');
  const btn  = document.getElementById('submitEventBtn');
  const cal  = document.getElementById('calendar');
  const noti = document.getElementById('notifications');

  // Функция для безопасного разбора JSON
  async function safeParseJSON(resp) {
    const ct = resp.headers.get('Content-Type') || '';
    const text = await resp.text();
    if (!ct.includes('application/json')) {
      console.error('Ответ не JSON:', text);
      throw new Error('Сервер вернул некорректный ответ (не JSON)');
    }
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error('Ошибка парсинга JSON:', e, '\nТекст ответа:', text);
      throw new Error('Ошибка парсинга JSON');
    }
  }

  // Загрузка и отрисовка календаря + уведомлений
  async function loadEvents() {
    cal.innerHTML = 'Загрузка…';
    noti.innerHTML = '';
    try {
      const resp = await fetch('get_events.php');
      if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
      const events = await safeParseJSON(resp);

      // Календарь
      cal.innerHTML = '';
      events.forEach(ev => {
        const d = document.createElement('div');
        d.textContent = `${ev.title} — ${ev.event_date}`;
        cal.appendChild(d);
      });

      // Уведомления
      noti.innerHTML = '';
      events.forEach(ev => {
        const n = document.createElement('div');
        n.textContent = `Напоминание: ${ev.title} в ${ev.event_date}`;
        noti.appendChild(n);
      });
    } catch (err) {
      console.error('Ошибка loadEvents:', err);
      cal.textContent = 'Не удалось загрузить события';
      alert(err.message);
    }
  }

  // Обработчик отправки формы
  form.addEventListener('submit', async e => {
    e.preventDefault();
    btn.disabled    = true;
    btn.textContent = 'Отправка…';

    // Собираем данные формы
    const payload = {
      title           : form.title.value.trim(),
      description     : form.description.value.trim(),
      event_date      : form.event_date.value,
      location        : form.location.value.trim(),
      max_participants: form.max_participants.value
                           ? parseInt(form.max_participants.value, 10)
                           : null,
      organizer_id    : form.organizer_id.value
                           ? parseInt(form.organizer_id.value, 10)
                           : null
    };
    console.log('Отправляем payload:', payload);

    try {
      const resp = await fetch('add_event.php', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload)
      });

      if (!resp.ok) {
        const text = await resp.text();
        console.error('add_event.php вернул ошибку HTTP:', resp.status, text);
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await safeParseJSON(resp);
      console.log('add_event.php ответ JSON:', data);

      if (data.status === 'success') {
        alert(`Событие создано, ID=${data.event_id}`);
        form.reset();
        await loadEvents();
      } else {
        throw new Error(data.message || 'Неизвестная ошибка от сервера');
      }
    } catch (err) {
      console.error('Ошибка при создании события:', err);
      alert('Ошибка: ' + err.message);
    } finally {
      btn.disabled    = false;
      btn.textContent = 'Создать мероприятие';
    }
  });

  // Стартуем
  loadEvents();
});
