// js/volunteer.js
document.addEventListener('DOMContentLoaded', () => {
  const form    = document.getElementById('volRegForm');
  const message = document.getElementById('volRegMessage');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    message.textContent = '';
    const data = {
      name:  form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim()
    };
    try {
      const resp = await fetch('add_volunteer.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await resp.json();
      if (json.status === 'success') {
        message.style.color = 'green';
        message.textContent = `ОК! ID нового волонтёра: ${json.volunteer_id}`;
        form.reset();
      } else {
        message.style.color = 'red';
        message.textContent = `Ошибка: ${json.message}`;
      }
    } catch (err) {
      console.error(err);
      message.style.color = 'red';
      message.textContent = 'Сетевая ошибка при попытке регистрации';
    }
  });
});
