document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatbot = document.getElementById('chatbot');
  const closeChat = document.getElementById('close-chat');
  const chatBody = document.getElementById('chat-body');
  const userInput = document.getElementById('user-input');
  const sendBtn = document.getElementById('send-btn');

  chatToggle.addEventListener('click', () => {
    chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
  });

  closeChat.addEventListener('click', () => {
    chatbot.style.display = 'none';
  });

  const sendMessage = async () => {
    const msg = userInput.value.trim();
    if (!msg) {
      console.error("Message is empty");
      return;
    }

    chatBody.innerHTML += `<div class="message user"><div class="bubble">${msg}</div></div>`;
    userInput.value = '';

    try {
      const res = await fetch('chatbot.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });

      const json = await res.json();
      if (json.error) {
        console.error("Server error:", json.error);
        chatBody.innerHTML += `<div class="message bot"><div class="bubble">Ошибка: ${json.error}</div></div>`;
      } else {
        chatBody.innerHTML += `<div class="message bot"><div class="bubble">${json.reply}</div></div>`;
      }
      chatBody.scrollTop = chatBody.scrollHeight;
    } catch (err) {
      console.error(err);
      chatBody.innerHTML += `<div class="message bot"><div class="bubble">Ошибка сервера</div></div>`;
    }
  };

  sendBtn.addEventListener('click', sendMessage);

  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
