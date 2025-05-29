document.getElementById('reportForm').addEventListener('submit', async e => {
  e.preventDefault();
  const fd = Object.fromEntries(new FormData(e.target).entries());
  const res = await fetch('add_report.php', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(fd)
  });
  const data = await res.json();
  alert(data.message);
});
