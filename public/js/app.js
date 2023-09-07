// JavaScript logic for sending and displaying messages
const messageContainer = document.getElementById('message-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const onlineUserCount = document.getElementById('online-user-count');
const onlineUserList = document.getElementById('online-user-list');

// Function to add a message to the chat
// function addMessage(message, fromUser = false, senderUsername) {
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message ${fromUser ? 'from-user' : ''}`;
    
//     if (fromUser) {
//         messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
//     } else if (senderUsername) {
//         messageDiv.innerHTML = `<strong>${senderUsername}:</strong> ${message}`;
//     } else {
//         messageDiv.textContent = message;
//     }
    
//     messageContainer.appendChild(messageDiv);

//     // Log the sender's username to the console
//     // console.log(`Message from ${senderUsername}: ${message}`);
// }

function addMessage(message, fromUser = false, senderUsername) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${fromUser ? 'from-user' : ''}`;

    // Replace specific text with emojis
    for (const [text, emoji] of Object.entries(textToEmojis)) {
        message = message.replace(new RegExp(text, 'g'), emoji);
    }

    if (fromUser) {
        messageDiv.innerHTML = `<strong>You:</strong> ${message}`;
    } else if (senderUsername) {
        messageDiv.innerHTML = `<strong>${senderUsername}:</strong> ${message}`;
    } else {
        messageDiv.textContent = message;
    }

    messageContainer.appendChild(messageDiv);
}


// addMessage(`Welcome ${username} 👋`);





// Function to display the list of text:emojis conversions
function displayEmojisModal() {
    const emojisModal = `
        <div class="modal fade" id="emojisModal" tabindex="-1" role="dialog" aria-labelledby="emojisModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="emojisModalLabel">Available Emojis:</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul>
                            <li>react: "🏵️"</li>
                            <li>woah: "😮"</li>
                            <li>hey: "👋"</li>
                            <li>lol: "😂"</li>
                            <li>like: "❤️"</li>
                            <li>congratulations: "🎉"</li>
                            <li>flower: "🌹"</li>
                            <li>cake: "🎂"</li>
                            <li>bless: "🙌"</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    messageContainer.insertAdjacentHTML('beforeend', emojisModal);
    $('#emojisModal').modal('show');
}

// Function to display a modal box with the list of available commands
function displayHelpModal() {
    const helpModal = `
        <div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="helpModalLabel">Available Commands:</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <ul>
                            <li>/help - Show the list of available commands.</li>
                            <li>/emojis - Show the list of text:emojis conversions available.</li>
                            <li>/clear - Clears the chat for you.</li>
                            <li>/random - Generate and display a random number (1 to 100).</li>
                            <li>/time - Display the current time (HH:MM:SS).</li>
                            <li>/date - Display the current date (DD/MM/YYYY).</li>
                            <li>/joke - Display a random joke.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    messageContainer.insertAdjacentHTML('beforeend', helpModal);
    $('#helpModal').modal('show');
}

// Function to handle the / command
function handleSlashCommand(command) {
    switch (command) {
        case '/help':
            displayHelpModal();
            break;
        case '/emojis':
            displayEmojisModal();
            break;
        case '/clear':
            messageContainer.innerHTML = '';
            break;
        case '/random':
            const randomNum = Math.floor(Math.random() * 100) + 1;
            addMessage(`Generated a random number: ${randomNum}`, true);
            break;
        case '/time':
            const currentTime = new Date().toLocaleTimeString();
            addMessage(`Current time: ${currentTime}`, true);
            break;
        case '/date':
            const currentDate = new Date().toLocaleDateString();
            addMessage(`Current date: ${currentDate}`, true);
            break;
        case '/joke':
            const jokes = [
                "Why don't scientists trust atoms? Because they make up everything!",
                "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
                "Parallel lines have so much in common. It's a shame they'll never meet.",
                "I used to play piano by ear, but now I use my hands.",
                "Why did the scarecrow win an award? Because he was outstanding in his field!",
                "I'm reading a book on anti-gravity. It's impossible to put down!",
                "I told my wife she was drawing her eyebrows too high. She looked surprised.",
                "I'm on a seafood diet. I see food, and I eat it!",
                "I'm friends with all electricians. We have good current connections.",
                "What did one wall say to the other wall? I'll meet you at the corner!"
            ];
            const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
            addMessage(randomJoke, true);
            break;
        default:
            addMessage(`Command not recognized: ${command}`, true);
    }
}

// Prompt for username
let username = prompt('Please enter your username:');
while (!username) {
    username = prompt('Username cannot be empty. Please enter your username:');
}

// Create a Socket.io connection
const socket = io();

// Emit the user's username to the server when they join
socket.emit('user-joined', username);


// Event listener for receiving messages from the server
socket.on('chat-message', (data) => {
    const { message, senderUsername } = data;
    addMessage(message, false, senderUsername || "Anonymous");
});

// Event listener for updating online users count and list
socket.on('update-online-users', (users) => {
    onlineUserCount.textContent = users.length;
    onlineUserList.innerHTML = users.map((user) => `<li class="text-dark">${user}</li>`).join('');
});

// Event listener for sending messages
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        if (message.startsWith('/')) {
            handleSlashCommand(message);
        } else {
            // Emit the message to the server using Socket.io here
            socket.emit('chat-message', message);
        }
        messageInput.value = '';
    }
});

// Event listener for sending messages on pressing Enter
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendButton.click();
    }
});

function greetingsByHighNitin(){
    console.log(`%cHello beautiful hooman, I'm glad you made it to console, my name is Nitin, my social name is HighNitin and I work as a freelance web developer, feel free to copy this project (only if you want) and connect on Linkedin: Highnitin - https://linkedin.com/in/highnitin. Always remember, you are special. 🙂❤️`, 'color: #ebedeb; background: #000; font-size: 15px; padding: 10px');
  }
  greetingsByHighNitin();