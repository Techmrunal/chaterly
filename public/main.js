const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  const prompt = document.getElementById('prompt');
  const chat = document.getElementById('chat');
  const usernameInput = document.getElementById('usernameInput');
  const joinButton = document.getElementById('joinButton');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');
  const messages = document.getElementById('messages');
  const activeUserCount = document.getElementById('activeUserCount');

  let username = '';

  joinButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username !== '') {
      prompt.style.display = 'none';
      chat.style.display = 'block';
      socket.emit('join', username);
      welcomeMessage.textContent = `Welcome ${username}!`;
    }
  });

  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
      socket.emit('message', { username, message });
      messageInput.value = '';
    }
  });

  socket.on('userList', (users) => {
    activeUserCount.textContent = users.length;
  });

//   socket.on('message', ({ username, message }) => {
//     const messageElement = document.createElement('div');
//     messageElement.classList.add('message');
//     messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
//     messages.appendChild(messageElement);
//     messages.scrollTop = messages.scrollHeight;
//   });
});

// ... (previous JavaScript code) ...

socket.on('message', ({ username, message }) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight; // Scroll to the latest message
  });
  

