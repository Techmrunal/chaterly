const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// Initialize an array to store online users
const onlineUsers = [];

io.on('connection', (socket) => {
    // When a user joins, store their username and emit the updated online users list
    socket.on('user-joined', (username) => {
        socket.username = username;
        onlineUsers.push(username);
        io.emit('update-online-users', onlineUsers);
        // let welcomeNote = document.getElementById("welcome-note");
        // welcomeNote.innerHTML = `High on Chat + ${username}`;
    });

    // When a user sends a chat message, broadcast it to all connected clients
    socket.on('chat-message', (message) => {
        io.emit('chat-message', { message, senderUsername: socket.username });
    });

    // When a user disconnects, remove them from the online users list and emit the updated list
    socket.on('disconnect', () => {
        const index = onlineUsers.indexOf(socket.username);
        if (index !== -1) {
            onlineUsers.splice(index, 1);
            io.emit('update-online-users', onlineUsers);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
