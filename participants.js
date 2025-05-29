document.addEventListener('DOMContentLoaded', () => {
  const eventId = new URLSearchParams(location.search).get('event_id');
  const list = document.getElementById('participantsList');
  const inpVolunteer = document.getElementById('volunteerIdInput');
  const btnReg = document.getElementById('btnRegister');
  const btnUnreg = document.getElementById('btnUnregister');

  async function loadParticipants() {
    const res = await fetch(`get_participants.php?event_id=${eventId}`);
    const data = await res.json();
    list.innerHTML = data.map(v=>`<li>${v.name} (${v.email}), зарегистрирован: ${v.registration_date}</li>`).join('');
  }

  btnReg.addEventListener('click', async ()=>{
    const vid = inpVolunteer.value.trim();
    if (!vid) return alert("Введите ваш ID");
    const res = await fetch('add_participant.php', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event_id: eventId, volunteer_id: vid })
    });
    const r = await res.json();
    alert(r.message);
    loadParticipants();
  });

  btnUnreg.addEventListener('click', async ()=>{
    const vid = inpVolunteer.value.trim();
    if (!vid) return alert("Введите ваш ID");
    const res = await fetch('remove_participant.php', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ event_id: eventId, volunteer_id: vid })
    });
    const r = await res.json();
    alert(r.message);
    loadParticipants();
  });

  loadParticipants();
});
