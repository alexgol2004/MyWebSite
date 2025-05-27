document.addEventListener('DOMContentLoaded', function() {
    const eventRegistrationForm = document.getElementById('event-registration-form');
    const eventIdInput = document.getElementById('event-id');
    const volunteerIdInput = document.getElementById('volunteer-id');
    const eventRegistrationResponse = document.getElementById('event-registration-response');

    eventRegistrationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const eventId = eventIdInput.value;
        const volunteerId = volunteerIdInput.value;

        try {
            // Отправка данных на сервер
            const response = await fetch('https://api.telegram.org/bot6739035007:AAEn_Y10WBZKstTIAGQVN5zuAhTc1z78tkw/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: 4957042539,
                    text: `Заявка на участие в мероприятии с ID ${eventId} от волонтера с ID ${volunteerId}.`
                })
            });

            const data = await response.json();

            if (data.ok) {
                eventRegistrationResponse.innerHTML = `<p>Заявка на участие в мероприятии отправлена</p>`;
                eventIdInput.value = '';
                volunteerIdInput.value = '';
            } else {
                eventRegistrationResponse.innerHTML = `<p>Ошибка: ${data.description}</p>`;
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            eventRegistrationResponse.innerHTML = '<p>Произошла ошибка при отправке заявки</p>';
        }
    });
});
