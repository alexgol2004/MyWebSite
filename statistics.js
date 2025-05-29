document.addEventListener('DOMContentLoaded', async () => {
  // вручную вводим свой ID или берём из авторизации
  const volunteerId = prompt("Введите ваш ID волонтёра для статистики");
  if (!volunteerId) return;

  const res = await fetch(`get_statistics.php?volunteer_id=${volunteerId}`);
  const stats = await res.json();

  document.getElementById('statistics').innerHTML = `
    <p>Всего часов: ${stats.total_hours}</p>
    <p>Всего задач выполнено: ${stats.total_tasks}</p>
  `;
});
